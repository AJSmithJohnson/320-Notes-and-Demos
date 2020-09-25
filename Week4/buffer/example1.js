const buff1 = Buffer.from("hello");//in node.js a buffer is a byte array so an array of 8 bits
console.log(buff1);

const buff2 = Buffer.from([255]);
console.log(buff2);

const buff3 = Buffer.from([1000]);

console.log(buff3);


const buff4 = Buffer.from([0, 255, 32, "HOW"]);//wipes string and elimanates data in this example though

console.log(buff4);


const buff5 = Buffer.alloc(10);



buff5.writeUInt8(255, 3);//says : write unsigned integer of 8 bits(a byte)

console.log(buff5);

buff5.writeUInt16BE(1000, 5);//BIg endian notation writes left to right

var val =buff5.readUInt8(3);

console.log(buff5);

console.log(val);

//from now on our buffer instead of being a long string is going
//to be an array of bytes we read or write to