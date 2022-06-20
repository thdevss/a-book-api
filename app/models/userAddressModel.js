const conn = require('../configs/database.config.js');
const bcrypt = require("bcryptjs");


const getAllAddress = async (userId = 0) => {
    if(userId < 1) {
        return {}
    }

    let query_str = `SELECT * FROM tb_user_address WHERE user_id = ? ORDER BY is_default DESC`
    let query_data = [];
    query_data.push(userId)

    console.log(query_str, query_data)

    const [ rows ] = await conn.execute(query_str, query_data);
    return rows;
}

const getOneAddress = async (addressId = 0, userId = 0) => {
    if(userId < 1) {
        return {}
    }

    let query_str = `SELECT * FROM tb_user_address WHERE user_id = ? `
    let query_data = [
        userId
    ];

    if(addressId > 0) {
        query_str += ` AND id = ? `;
        query_data.push(addressId)
    } else {
        query_str += ` AND is_default = 1 `
    }

    

    query_str += ` LIMIT 1 `
    console.log(query_str, query_data)

    const [ rows ] = await conn.execute(query_str, query_data);

    if(rows.length == 1) {
        return {
            status: true,
            data: rows[0]
        }
    }

    return {
        status: false,
        data: []
    };
}

const addNewAddress = async (userId = 0, address1 = null, address2 = null, addressSubDistrict = null, addressDistrict = null, addressProvince = null, addressPostelCode = null, addressCountry = null, is_default = 1) => {
    if(userId < 1) {
        return {
            status: false,
            message: `user not found`
        };
    }

    // check user has other address ?, for set default
    const [ rows_address ] = await conn.execute(`SELECT id FROM tb_user_address WHERE user_id = ?`, [ userId ]);
    // if(rows_address[0].count > 0) {
    if(rows_address.length > 0) {
        if(is_default == 1) {
            // unset is_default all user's row
            await conn.execute(`UPDATE tb_user_address SET is_default = 0 WHERE user_id = ?`, [ userId ]);
            is_default = 1;
        } else {
            is_default = 0;
        }
    } else {
        // if first address, force for this to default address
        if(is_default == 0) {
            is_default = 1;
        }
    }

    let query_str = `INSERT INTO tb_user_address (user_id, address_1, address_2, address_sub_district, address_district, address_province, address_postel_code, address_country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let query_data = [
        userId,
        address1,
        address2,
        addressSubDistrict,
        addressDistrict,
        addressProvince,
        addressPostelCode,
        addressCountry,
        is_default
    ];

    try {
        const [ rows ] = await conn.execute(query_str, query_data);
        return {
            status: true,
            message: `inserted!`,
            id: rows.insertId
        };
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: `can't insert address: ${error.code}`
        };
    }
}

const updateAddress = async (userId = 0, addressId = 0, address1 = null, address2 = null, addressSubDistrict = null, addressDistrict = null, addressProvince = null, addressPostelCode = null, addressCountry = null, is_default = null) => {
    if(userId < 1 || addressId < 1) {
        return {
            status: false,
            message: `data not found`
        };
    }

    let query_str = `UPDATE tb_user_address SET `
    let query_data = [];

    if(address1) {
        query_str += `address_1 = ?, `
        query_data.push(address1)
    }
    if(address2) {
        query_str += `address_2 = ?, `
        query_data.push(address2)
    }
    if(addressSubDistrict) {
        query_str += `address_sub_district = ?, `
        query_data.push(addressSubDistrict)
    }
    if(addressDistrict) {
        query_str += `address_district = ?, `
        query_data.push(addressDistrict)
    }
    if(addressProvince) {
        query_str += `address_province = ?, `
        query_data.push(addressProvince)
    }
    if(addressPostelCode) {
        query_str += `address_postel_code = ?, `
        query_data.push(addressPostelCode)
    }
    if(addressCountry) {
        query_str += `address_country = ?, `
        query_data.push(addressCountry)
    }

    if(is_default == 1) {
        query_str += `is_default = ?, `
        query_data.push(is_default)

        await conn.execute(`UPDATE tb_user_address SET is_default = 0 WHERE user_id = ?`, [ userId ]);
    }
    

    query_str += ` updated_at = NOW() WHERE id = ? AND user_id = ? `;
    query_data.push(addressId)
    query_data.push(userId)

    try {
        const [ rows ] = await conn.execute(query_str, query_data);
        console.log( query_str, query_data)
        
        if(rows.affectedRows == 1) {
            return {
                status: true,
                message: `updated!`,
                id: rows.insertId
            };
        }
    } catch (error) {
        console.log(error, query_str, query_data)
        return {
            status: false,
            message: `can't update book: ${error.code}`
        };
    }


    return {
        status: false,
        message: `not thing to do!`
    };

}

const deleteAddress = async (userId = 0, addressId = 0) => {
    let query_str = `DELETE FROM tb_user_address WHERE id = ? AND user_id = ?`
    let query_data = [
        addressId,
        userId
    ];
    
    try {
        const [ rows ] = await conn.execute(query_str, query_data);
        if(rows.affectedRows == 1) {
            return {
                status: true,
                message: `deleted!`
            };
        }
    } catch (error) {
        return {
            status: false,
            message: `can't delete address: ${error.code}`
        };
    }


    return {
        status: false,
        message: `not thing to do!`
    };
}

module.exports = { 
    getAllAddress,
    addNewAddress,
    updateAddress,
    deleteAddress,
    getOneAddress
};