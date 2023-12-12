/** @format */

router.get('/', async (req, res, next) => {
    try{
        const fetchHomeData = new FetchHomeData()
        const fetchHomeDataHandler = new FetchHomeDataHandler()
        const responseData = await fetchHomeDataHandler.handle(fetchHomeData)
        res.status(200).json(responseData)
    }catch(error){
        console.log(error)
        next(new customError("Failed to fetch home page data", 500, 'error'))
    }
})

router.post('/evaluate', 
[   
    body('quantity').isInt().withMessage('Quantity must be a whole number'),
    body('datePurchased')
    .custom((value) => {
      // Check if the date has the format "yyyy-mm-dd"
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new customError('Date must be in the format YYYY-MM-DD', 400, 'warn');
      }

      // Check if the value can be successfully converted to a Date object
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    })
    .withMessage('Invalid date format or value'),
],
async (req,res,next)=> {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new customError(errors.array()[0].msg, 400, 'warn')
        }
        const type = req.query.type
        const assetpayload = req.body
        const getAssetWorth = new GetAssetWorth(type, assetpayload)
        const getAssetWorthHandler = new GetAssetWorthHandler()
        const profit_data = await getAssetWorthHandler.handle(getAssetWorth)
        res.status(200).json(profit_data)
    }catch(error){
        if(error.status === 400){
            next(error)
        }
        next(new customError("Failed to evaluate asset worth", 500, 'error'))
    }
})

module.exports = router
