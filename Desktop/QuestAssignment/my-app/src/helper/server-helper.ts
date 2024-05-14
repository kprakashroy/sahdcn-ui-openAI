var prisma = require("prisma")


export default  async function connectToDatabase() {
    try{
        prisma.$connect
        console.log("database conected")
    }
    catch(err){
            console.log(err)
    }
}