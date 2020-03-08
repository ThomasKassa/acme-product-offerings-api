const pg = require('pg')
const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL  || 'postgres://localhost/acme_offerings')


const Product = conn.define('product',
{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    suggestPrice: {
        type: Sequelize.DECIMAL(10,2),
    }
})

const Company = conn.define('company',
{
    id:{
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

const Offering = conn.define('offering',
{
    price: {
        type: Sequelize.DECIMAL(10,2)
    }
})

Offering.belongsTo(Company)
Offering.belongsTo(Product)


const sync = async() =>
{ 
    await conn.sync({ force: true })

    const [ Apple, Schwinn, Ospery ] = await Promise.all([
        Company.create({ name: 'Apple' }),
        Company.create({ name: 'Schwinn' }),
        Company.create({ name: 'Ospery' })
    ]);
    
    const [ Computer, Bicycle, Surfboard ] = await Promise.all([
        Product.create({ name: "Computer" , suggestedPrice: 850 }),
        Product.create({ name: "Bicycle" , suggestedPrice: 120 }),
        Product.create({ name: "Surfboard" , suggestedPrice: 100 })
    ]);
    
    await Promise.all([
        Offering.create({ price: 1199.99, productId: Computer.id, companyId: Apple.id}),
        Offering.create({ price: 199.99, productId: Bicycle.id, companyId: Schwinn.id}),
        Offering.create({ price: 174.99, productId: Surfboard.id, companyId: Ospery.id})
    ]);
    
    
}

module.exports = 
{ 
    sync,
    models: {
        Product,
        Company,
        Offering
    }
}