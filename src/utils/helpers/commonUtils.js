const commonUtils = {
    formatUserDetails: function (userData, type) {
        const { _id, firstName, lastName, email, phone, address } = userData;
    
        const userDetails = {};
        userDetails._id = _id;
        userDetails.firstName = firstName;
        userDetails.lastName = lastName;
        userDetails.email = email;
        
        if (type === "unrestricted") {
            userDetails.phone = phone;
            userDetails.address = address;
        }

        return userDetails;
    }
};

module.exports = commonUtils;