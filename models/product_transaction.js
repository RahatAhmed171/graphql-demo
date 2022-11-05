const Sequelize=require('sequelize')

const sequelize=new Sequelize('graphql_demo','root','12345678',{
    dialect:'mysql'
})

const product=sequelize.define('product',{
    id:{
        type: Sequelize.DataTypes.STRING,
        primaryKey:true,
       
    },

   
},
{
    freezeTableName: true,
    timestamps: false,
})





const transaction=sequelize.define('transaction',{
    transaction_id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
       
    },
    quantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull:false
    },
  
    time:{
        type: Sequelize.DataTypes.DATE,
        allowNull:false
        
    },
   
},
{
    freezeTableName: true,
    timestamps: false,
})

product.hasMany(transaction,{foreignKey:{allowNull:false}},
    {onDelete:"CASCADE"})



module.exports={sequelize,product,transaction}