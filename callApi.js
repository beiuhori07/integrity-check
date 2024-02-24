const axios = require('axios');

axios.get('https://example.com/api/path')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
