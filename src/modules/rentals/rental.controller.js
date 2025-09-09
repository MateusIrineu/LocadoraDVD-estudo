import models from "..";
import { Dvd } from "../dvds/dvd.model";

const { Rental } = models;

class RentalController {
    static async createRental(req, res, next) {
        try {
            // campos para user (já verficado com JWT) e dvd
            const userId = req.user.id
            const { dvdId } = req.body;

            if(!dvdId) {
                return res.status(400).json({ message: "dvdId is required." });
            }

            // verifica se o dvd existe e está disponível
            const dvd = await Dvd.findByPk(dvdId);
            if (!dvd) {
                return res.status(404).json({ message: "Dvd not found." });
            }

            // checa se o dvd está diponível
            if(!dvd.available) {
                return res.status(400).json({ message: "Dvd is not available for rental." });
            }

            const threeDaysFromNow = 3 * 24 * 60 * 60 * 1000; // 3 dias em milisegundos;
            const rentalDate = new Date();
            const dueDateMs = rentalDate.getTime() + threeDaysFromNow;
            const dueDate = new Date(dueDateMs);
            

            // se estiver disponível, cria o aluguel
            const rental = await Rental.create({
                userId,
                dvdId,
                status: 'rented',
                dueDate
            });

            // se alugar, o available vai para false, e incrementa em 1 o aluguel daquele dvd
            if(rental) {
                await dvd.update({ available: false, rentedCount: dvd.rentedCount + 1 })
                return res.status(201).json({ message: "Rental created successfully", rental });
            }

        } catch (error) {
            next(error);
        }};

static async returnRental(req, res, next) {
    try {
        const { rentalId } = req.body;
        if (!rentalId) {
            return res.status(400).json({ message: "rentalId is required." });
        }

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ message: "Rental not found." });
        }

        const returnDate = new Date();

        // caso o aluguel estava apenas "rented" (dentro do prazo)
        if (rental.status === 'rented') {
            await rental.update({ status: 'returned', returnDate });

            const dvd = await Dvd.findByPk(rental.dvdId);
            if (dvd) await dvd.update({ available: true });

            return res.status(200).json({ message: "Rental returned on time.", returnDate });
        }

        // caso o aluguel já estava marcado como "returned" (redundante, mas seguro)
        if (rental.status === 'returned') {
            await rental.update({ returnDate });

            return res.status(200).json({ message: "Rental already returned.", returnDate });
        }

        // caso o aluguel estava atrasado ("late")
        if (rental.status === 'late') {
            const dueDate = rental.dueDate;

            const msPerDay = 24 * 60 * 60 * 1000;
            const daysLate = Math.max(0, Math.ceil((returnDate - dueDate) / msPerDay));

            const dailyFee = 2.00;
            const fee = daysLate * dailyFee;

            await rental.update({
                returnDate,
                lateDays: daysLate,
                lateFee: fee,
                status: 'returned'
            });

            const dvd = await Dvd.findByPk(rental.dvdId);
            if (dvd) await dvd.update({ available: true });

            return res.status(200).json({ message: "Rental returned with late fee.", lateDays: daysLate, lateFee: fee });
        }

    } catch (error) {
        next(error);
    }
}

}