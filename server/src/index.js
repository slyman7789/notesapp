import app from './app.js';
import { connectDB } from "./config/mongoDb.js";

const port = process.env.PORT || 6000

connectDB()
.then(()=> {
try{
    app.listen(process.env.PORT, ()=> {
        console.log(`server running on port ${port}`);
    })
} catch (error) {
    console.log('Cannot connect to server');
}
})
.catch((error) => {
    console.log("Invalid database connection");
});