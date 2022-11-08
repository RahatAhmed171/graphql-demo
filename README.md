This is a demonstration of GraphQL API. It is a simple product store where we create, read and delete a product along with its transactions with the help of GraphQL.
Tech stack: NodeJS, MySQL

Database design of the project:
![product-transaction](https://user-images.githubusercontent.com/69518859/200122366-f18b3ec0-09c5-4b98-aca3-6b6ed9517589.JPG)

How to use the api:

a) To get all product along with transactions:
```javascript
  Query{
    products{
      id
      transaction
      }
   }
 ```
   
b) To get a single product along with its transactions:
```javascript
Query{
  product(id:"bcd123"){
    id
    transactions
    }
 }
```
 
c) Add a product:
```javascript
Mutation{
 addProduct(id:"xyz123"){
  id
  }
}
```


d) Add a transaction for a product:
```javascript
Mutation{
  addTransaction(quantity:3, time:"2022-10-22", productId:"xyz123"){
    id
    quantity
    time
    }
  }
 ```
  
e) Delete a product:
```javascript
deleteProduct(id:"xyz123"){
  }
 ```
f) Subscribing to event to get notification when product is added or deleted

```javascript
subscription{
  notifyuser{
    mutation
    }
}
 ```

  
