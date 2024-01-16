const axios = require("axios")

const verifyRecaptcha = async(req, res) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const token = req.body.recaptcha_token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    try {
        const response = await axios.post(url)
        console.log("recaptcha response data:", response.data)
        if(response.data.success) {
            return res.json({
                'human': true
            })
        } else {
            return res.json({
                'human': false
            })
        }
    } catch (error) {
        return res.status(500).send("Error in CAPTCHA verification")
    }

}

module.exports = {verifyRecaptcha}