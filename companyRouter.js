const routes = require('express').Router();
const sanitizer = require('./sanitizer').sanitizer;
const { response } = require("./const");
const { getCompanys, getCompany, createCompany, deleteCompany, searchCompanys, updateCompany, updatePartialCompany } = require("./companyService");
/**
* @swagger
*
* /api/v1/companys/:
*   get:
*     description: It provide the list of all the companys
*     produces:
*       - application/json
*     responses:
*       200:
*         description: successful operation, get the list of all companies
*       500:
*         description: internal service error
*/

/**
* @swagger
*
* /api/v1/companys:
*   get:
*     description: It searches through the list of companies
*     parameters:
*       - in: query
*         name: searchTerm
*         description: term to search inside company database 
*         required: true
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*         description: successful operation, get the search result
*       204:
*         description: No content found related to your query
*       400:
*         description: Invalid query sent
*       500:
*         description: internal service error
*/
routes.get('/', async (req, res) => {
    let companyList = {};
    // request validation
    if (Object.keys(req.query).length === 0) {
        // calling service
        companyList = await getCompanys();
    } else {
        // validation
        if (!req.query.searchTerm) {
            return response(res, 400, 'error', 'Invalid query');
        }
        let sanitized_search;
        // sanitization
        sanitized_search = sanitizer.value(req.query.searchTerm, 'string');
        // validation
        if (sanitized_search !== req.query.searchTerm) {
            return response(res, 400, 'error', 'Invalid query');
        }

        // calling service -> transformation*
        companyList = await searchCompanys(sanitized_search);

        // output validate
        if (companyList.length === 0) {
            return response(res, 404, 'error', 'No content found related to your query')
        }
    }

    // output validation
    if (companyList.error) {
        return response(res, 500, 'error', companyList.error);
    }

    return response(res, 200, 'data', companyList);
});

/**
* @swagger
*
* /api/v1/companys/{id}:
*   get:
*     description: get the company with a specific id
*     parameters:
*       - in: path
*         name: id
*         description: get the company with a specific id 
*         required: false
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*         description: successful operation, get the data of required company
*       404:
*         description: no company found
*       500:
*         description: internal service error
*/
routes.get('/:id', async (req, res) => {
    let sanitized_id;
    // sanitization
    sanitized_id = sanitizer.value(req.params.id, 'int');

    // call to the service
    company = await getCompany('' + sanitized_id);

    // output validation
    if (company.error) {
        return response(res, 500, company.error);
    }

    // output validation
    if (company.length === 0) {
        return response(res, 404, 'error', 'No company found with the given id')
    }

    return response(res, 200, 'data', company);
});

/**
* @swagger
*
* /api/v1/companys:
*   post:
*     description: set the company data
*     parameters:
*       - in: formData
*         name: id
*         description: id of the new company 
*         required: true
*         type: string
*       - in: formData
*         name: name
*         description: name of the new company
*         required: true
*         type: string
*       - in: formData
*         name: city
*         description: city of the new company
*         required: true
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*         description: successful operation
*       400:
*         description: invalid user input
*       500:
*         description: internal service error
*/
routes.post('/', async (req, res) => {
    // validation
    if (!req.body.id || !req.body.name || !req.body.city) {
        return response(res, 400, 'error', 'Invalid user input');
    }

    let sanitized_id, sanitized_name, sanitized_city;
    // sanitization
    sanitized_id = sanitizer.value(req.body.id, 'int');
    sanitized_name = sanitizer.value(req.body.name, 'string');
    sanitized_city = sanitizer.value(req.body.city, 'string');

    // validation
    if (isNaN(sanitized_id) || sanitized_name != req.body.name || sanitized_city != req.body.city) {
        return response(res, 400, 'error', 'Invalid user input');
    }

    const company = await createCompany(sanitized_id + '', sanitized_name, sanitized_city);

    if (company.error) {
        return response(res, 500, 'error', company.error);
    }

    return response(res, 200, 'data', {
        id: req.body.id,
        name: sanitized_name,
        city: sanitized_city
    });
});


/**
* @swagger
*
* /api/v1/companys/{id}:
*   delete:
*     description: delete the company with a specific id
*     parameters:
*       - in: path
*         name: id
*         description: id of the company to delete 
*         required: true
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*         description: successful operation
*       400:
*         description: invalid user input
*       404:
*         description: company you're trying to delete does not exist
*       500:
*         description: internal service error
*/
routes.delete('/:id', async (req, res) => {
    // validation
    if (!req.params.id) {
        return response(res, 400, 'error', 'Invalid user input');
    }
    let sanitized_id;
    // sanitization
    sanitized_id = sanitizer.value(req.params.id, 'int');

    // validation
    if (isNaN(req.params.id) || sanitized_id + '' != req.params.id) {
        return response(res, 400, 'error', 'Invalid user input');
    }
    company = await deleteCompany(req.params.id);

    if (company.error) {
        return response(res, 500, 'error', company.error);
    }

    if (company['affectedRows']===0) {
        return response(res, 404, 'error', "company you're trying to delete does not exist");
    }

    return response(res, 200, 'data', {
        id: req.params.id
    });
});



/**
* @swagger
*
* /api/v1/companys/{id}:
*   put:
*     description: set the company data
*     parameters:
*       - in: path
*         name: id
*         description: id of the company whose data is to be updated 
*         required: true
*         type: string
*       - in: formData
*         name: id
*         description: new id of the company 
*         required: false
*         type: string
*       - in: formData
*         name: name
*         description: new name of the company
*         required: false
*         type: string
*       - in: formData
*         name: city
*         description: new city of the company
*         required: false
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*         description: successful updation
*       400:
*         description: invalid user input
*       500:
*         description: internal service error
*/
routes.put('/:id', async (req, res) => {
    if (!req.params.id) {
        return response(res, 400, 'error', 'Invalid user input');
    }

    let sanitized_old_id, sanitized_id, sanitized_name, sanitized_city;
    // sanitization
    sanitized_old_id = sanitizer.value(req.params.id, 'int');
    sanitized_id = sanitizer.value(req.body.id, 'int');
    sanitized_name = sanitizer.value(req.body.name, 'string');
    sanitized_city = sanitizer.value(req.body.city, 'string');

    if (sanitized_old_id + '' != req.params.id || isNaN(sanitized_old_id) || sanitized_old_id===undefined) {
        return response(res, 400, 'error', 'Invalid user input')
    }

    const company = await updateCompany(sanitized_old_id, isNaN(sanitized_id) ? null : sanitized_id + '', sanitized_name===undefined?null:sanitized_name, sanitized_city===undefined?null:sanitized_name);

    if (company.error) {
        return response(res, 500, 'error', company.error);
    }
    return response(res, 200, 'data', {
        id: '' + sanitized_id,
        name: sanitized_name,
        city: sanitized_city
    });
});


/**
* @swagger
*
* /api/v1/companys/{id}:
*   patch:
*     description: set the company data
*     parameters:
*       - in: path
*         name: id
*         description: id of the company whose data is to be updated 
*         required: true
*         type: string
*       - in: formData
*         name: id
*         description: new id of the company 
*         required: false
*         type: string
*       - in: formData
*         name: name
*         description: new name of the company
*         required: false
*         type: string
*       - in: formData
*         name: city
*         description: new city of the company
*         required: false
*         type: string
*     produces:
*       - application/json
*     responses:
*       200:
*         description: success
*       400:
*         description: invalid/incorrect arguments
*       500:
*         description: internal service error
*/
routes.patch('/:id', async (req, res) => {
    if (!req.params.id || (!Object.keys(req.body).length === 0)) {
        return response(res, 400, 'error', 'Invalid user input');
    }

    let sanitized_old_id, sanitized_id, sanitized_name, sanitized_city;
    // sanitization
    sanitized_old_id = sanitizer.value(req.params.id, 'int');
    sanitized_id = sanitizer.value(req.body.id, 'int');
    sanitized_name = sanitizer.value(req.body.name, 'string');
    sanitized_city = sanitizer.value(req.body.city, 'string');

    const company = await updatePartialCompany(`${sanitized_old_id}`, `${sanitized_id}`, sanitized_name, sanitized_city);

    if (company.error) {
        return response(res, 500, 'error', company.error);
    }
    return response(res, 200, 'data', {
        id: '' + sanitized_id === null ? sanitized_old_id : sanitized_id
    });
});

module.exports = routes;