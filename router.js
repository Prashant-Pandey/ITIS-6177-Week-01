const routes = require('express').Router();
const company = require('./companyRouter');

routes.get('/', (req, res)=>{
    res.json({
        'New API Guide':{
            'swagger': '/api/v1/docs'
        },
        'Old API Guide':{
            'Company':[{
                url:'/api/v1/companys',
                method:'GET',
                arg: 'none',
                description:'get the list of all companies'
            },{
                url:'/api/v1/companys/company_id',
                method:'GET',
                arg: 'none',
                description:'get the details of a specific company'
            },{
                url:'/api/v1/companys?searchTerm=search_term',
                method:'GET',
                arg: 'none',
                description:'search from all the companies'
            },{
                url:'/api/v1/companys',
                method:'POST',
                arg: {
                    'id':'string',
                    'name':'string',
                    'city': 'string'
                },
                description:'create new company'
            },{
                url:'/api/v1/companys/company_id',
                method:'PUT',
                arg: {
                    'name':'string',
                    'city': 'string'
                },
                description:'update existing company, use company id to uniquely identify the company'
            },{
                url:'/api/v1/companys/company_id',
                method:'DELETE',
                arg: 'none',
                description:'delete a company'
            }]
        }
    })
});

routes.use('/companys', company);

module.exports = routes;