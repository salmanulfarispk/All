

export const generateotp=async()=>{
    return Math.floor(1000+ Math.random() * 9000)   // generates a random number between 1000 and 9999.
}