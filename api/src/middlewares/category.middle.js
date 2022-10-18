const categoryModel = require('../models/category.model')
const categoryMiddle = {}

categoryMiddle.getCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findOne({ _id: req.params.id });
        console.log('getCategory:', category);
        if (category == null) {
            return res.status(404).json({ status: 'error', message: 'Cannot find category' })
        }
        res.category = category
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

module.exports = categoryMiddle;