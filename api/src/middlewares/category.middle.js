const categoryModel = require('../models/category.model')
const categoryMiddle = {}

categoryMiddle.getCategory = async (req, res, next) => {
    try {
       // const category = await categoryModel.findOne({ _id: req.params.id }).populate([{path:'needed_part',strictPopulate:false,select:' item item_name _id'}]);
        const category = await categoryModel.findOne({ _id: req.params.id }).populate('needed_part.part');
        //console.log('getCategory:', category);
        if (category == null) {
            return res.status(404).json({ status: 'error', message: 'Cannot find products' })
        }
        res.category = category
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

module.exports = categoryMiddle;