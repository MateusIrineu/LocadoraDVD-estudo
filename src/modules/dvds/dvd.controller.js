import models from "..";

const { Dvd } = models;

class DvdController {
    static async createDvd(req, res, next) {
        try {
            const { title, genre, releaseYear } = req.body;

            // verifica se todos os campos foram preenchidos, apenas os que não são default:
            if (!title || !genre || !releaseYear) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const dvd = await Dvd.create({ title, genre, releaseYear });

            res.status(201).json({ message: "DVD created successfully", dvd });

        } catch (error) {
            next(error);
        }};

        static async listDvds(req, res, next) {
            try {

                const dvds = await Dvd.findAll();
                res.status(200).json(dvds);

            } catch (error) {
                next(error);
            }};

        static async getDvdById(req, res, next) {
            try {
                
                const { id } = req.params
                const dvd = await Dvd.findByPk(id);
                if (!dvd) {
                    return res.status(404).json({ message: "DVD not found." });
                }

                res.status(200).json(dvd);

            } catch (error) {
                next(error);
            }};

        static async updateDvd(req, res, next) {
            try {
                
                const dvdId = req.params.id;
                const { title, genre, releaseYear, available, rentedCount  } = req.body;
                
                const findingDvd = await Dvd.findByPk(dvdId);
                if (!findingDvd) {
                    return res.status(404).json({ message: "DVD not found." });
                }

                const updatedFields = {};
                if (title) updatedFields.title = title;
                if (genre) updatedFields.genre = genre;
                if (releaseYear) updatedFields.releaseYear = releaseYear;
                if (available !== undefined) updatedFields.available = available;
                if (rentedCount !== undefined) updatedFields.rentedCount = rentedCount;

                const [rowsUpdated] = await Dvd.update(
                    { ...updatedFields },
                    { where: { id: dvdId },
                    returning: true });

                if (rowsUpdated === 0) {
                    return res.status(400).json({ message: "No changes made to the DVD." });
                }

                res.status(200).json({ message: "DVD updated successfully." });

            } catch (error) {
                next(error);
            }};

        static async deleteDvd(req, res, next) {
            try {
                
                const dvdId = req.params.id;

                const findingDvd = await Dvd.findByPk(dvdId);
                if (!findingDvd) {
                    return res.status(404).json({ message: "DVD not found." });
                }

                await Dvd.destroy({ where: { id: dvdId } });

                res.status(200).json({ message: "DVD deleted successfully." });

            } catch (error) {
                next(error)
            }};
}

export default DvdController; 