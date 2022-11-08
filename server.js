
const {createServer,createPubSub}=require('graphql-yoga')
const {sequelize,product,transaction}=require('./models/product_transaction')


const pubsub=createPubSub()
const server=createServer({
    schema:{
        typeDefs:
        `
      
        type TransactionType{
            id:String!
            quantity:Int!
            time: String!
        }
    
        type ProductType{
            id:String!
            transactions:[TransactionType]
           
        }
        type Query {
            products:[ProductType]
            product(id: String):ProductType
        }
        type Mutation{
            addProduct(id:String!):ProductType
            addTransaction(quantity:Int!,time:String!,productId:String!):TransactionType
            deleteProduct(id:String!):Int
        }
        type AddProductSubscriptionPayload{
            mutation:String!
        }

        type Subscription{
            notifyuser: AddProductSubscriptionPayload
        }
        `,
        resolvers:{
        Query:{
  
            async products() {
                let result= await product.findAll({attributes:['id']})
                return result
              },
            async product(parent, args) {
                let result=await product.findByPk(args.id)
              
                return result
              }
        },
        ProductType:{
            transactions:async(product)=>{
                let result=await transaction.findAll({attributes:['productId','quantity','time'],where:{productId:product.id}})
                return result
            }
        },
        TransactionType:{
            id:(parent)=>{
               return parent.productId 
            }
        },
        Mutation:{
            async addProduct(parent,args){
                let result=await product.create({id:args.id})
                pubsub.publish('notifyuser',{
                    notifyuser:{
                        mutation:`A product with ${args.id} has been added`,
                      
                    }
                })
                
                return result
            },
            async addTransaction(parent,args){
                let time_now=new Date(args.time)
                let result=await transaction.create({quantity:args.quantity,time:time_now,productId:args.productId})
                return result
            },
            async deleteProduct(parent,args){
                let result=await product.destroy({
                    where:{id:args.id}
                })
                pubsub.publish('notifyuser',{
                    notifyuser:{
                        mutation:`A product with ${args.id} has been deleted`,
                      
                    }
                })
                return result
            }
        },
        Subscription:{
            notifyuser:{
                subscribe(parent,args){
                    return pubsub.subscribe('notifyuser')
                }
            }
        }
    }

        
    }
   
})
server.start()





