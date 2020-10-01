const routes = require('express').Router();

const {response400, response500} = require("./const");
const { getCompanys, getCompany, createCompany, deleteCompany, searchCompanys } = require("./companyService");

routes.get('/', async (req, res) => {
    let companyList = {};
    if (Object.keys(req.query).length===0) {
        companyList = await getCompanys();
    }else{
        companyList = await searchCompanys(req.query);
        if(companyList.status===400){
            return response400(res);
        }
    }
    
    if (companyList.error) {
        return response500(res, companyList.error);
    }

    res.json(companyList);
});

routes.get('/:id', async (req, res) => {
    company = await getCompany(req.params.id);
    
    if (company.error) {
        return response500(res, company.error);
    }

    res.json(company);
});

routes.post('/', async (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.city) {
        return response400(res);
    }
    
    const company = await createCompany(req.body.id, req.body.name, req.body.city);

    if (company.error) {
        return response500(res, company.error);
    }

    res.send({
        operation: 'success'
    });
});

routes.delete('/:id', async (req, res)=>{
    if (!req.params.id) {
        return response400(res);
    }
    console.log(req.params.id);
    company = await deleteCompany(req.params.id);
    
    if (company.error) {
        return response500(res, company.error);
    }

    res.json(company);
});

module.exports = routes;