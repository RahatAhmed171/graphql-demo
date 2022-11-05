const express=require('express')
const{graphqlHTTP}=require('express-graphql')
const{GraphQLSchema,GraphQLObjectType,GraphQLList,GraphQLString,GraphQLInt,GraphQLNonNull,GraphQLBoolean, subscribe}=require('graphql')

const {sequelize,product,transaction}=require('./models/product_transaction')


// Subscription feature hasn't been implemented yet

const TransactionType=new GraphQLObjectType({
    name:'Transaction',
    description: 'This is a representation of a transaction',
    fields:()=>({
        id: {type:new GraphQLNonNull(GraphQLString),
            resolve:async(parent)=>{
                return parent.productId
            }
        },
        quantity:{type:GraphQLInt},
        time: {type: GraphQLString}
    })
})
const ProductType=new GraphQLObjectType({
    name:'Product',
    description: 'This is a representation of a product',
    fields:()=>({
        id: {type:new GraphQLNonNull(GraphQLString)},
        transactions:{
            type: new GraphQLList(TransactionType),
            resolve:async(product)=>{
                let result=await transaction.findAll({attributes:['productId','quantity','time'],where:{productId:product.id}})
                return result
            }
        }
    })
})

const rootquery=new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields:()=>({
           product:{
            type: ProductType,
            description: "a single book",
            args:{
                id:{type: GraphQLString}
            },
            resolve:async(parent,args)=>{
                
                let result=await product.findByPk(args.id)
          
                return result
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            description: 'List of all products',
            resolve:async()=>{
               let result= await product.findAll({attributes:['id']})
               return result
                
            }
        }

     
    })
})

const RootMutationType= new GraphQLObjectType({
    name:'Mutation',
    description:"Root Mutation",
    fields:()=>({
        addProduct:{
            type: ProductType,
            description:"Adding a product",
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                let result=await product.create({id:args.id})
                
                return result
            }
        },
        addTransaction:{
            type: TransactionType,
            description:"Adding a transaction",
            args:{
                quantity:{type:GraphQLInt},
                time: {type: GraphQLString},
                productId:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                let time_now=new Date(args.time)
                let result=await transaction.create({quantity:args.quantity,time:time_now,productId:args.productId})
                return result
            }

        },
        deleteProduct:{
            type: GraphQLInt,
            description:"Deleting a product",
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                return await product.destroy({
                    where:{id:args.id}
                })
            }
        }

    })
})





const schema=new GraphQLSchema({
    query:rootquery,
    mutation: RootMutationType
  
})
const app=express()
app.use('/graphql',graphqlHTTP({
    schema:schema,
    graphiql:true
}));
app.listen(1234)
console.log('Running graphql server')

