module.exports = class ApiService {
    /**
     * Create class instance and fill params from URL or fill it with default values if URL not contain needed data.
     * @constructs
    */
    constructor() {
        this.fetchAPI = require('axios');
        //================Platform API URL================================
        this.baseUrl = process.env.PLATFORM_BASE_URL;
        //================================================================

    };
    async getData(options) {
        try {
            let response = await this.fetchAPI(options);
            return response.data.data;
        } catch (err) {
            console.log("getData Error log: ", err);
        }
    };

    async verifyGameToken(_token) {
        try {
            let data = {
                "token": _token
            };
            let config = {
                method: 'post',
                url: `${this.baseUrl}/verify-game-token`,
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : data
            };
            return (await this.getData(config));
        } catch (err) {
            console.log("GameTokenAuthentication error : ", err);
        }
    };
};

