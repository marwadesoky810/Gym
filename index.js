import express from 'express';

import fs from 'fs';

let memberData = JSON.parse(fs.readFileSync('./member.json', 'utf8'));
let trainerData = JSON.parse(fs.readFileSync('./trainer.json', 'utf8'));


const app = express();

app.use(express.json());

//! Get all revenues of all members.
app.get("/getallcost", (req,res,next)=>{
   let cost = 0;
   for (let i = 0;i< memberData.length; i++) {
    cost  += memberData[i].memberShip.cost; ;
   }
   res.json(cost);
})

// !Get the revenues of a specific trainer.

app.get("/trainercost/:id", (req,res,next)=>{
    let cost = 0;
    for (let i = 0;i< memberData.length; i++) {
      if (memberData[i].trainerId == req.params.id) {
        cost += memberData[i].memberShip.cost;
      }
    }
   res.json(cost);

});
 
//! add member must be unique
app.post("/addmember",(req,res,next)=>{
    let newMember = req.body;

    let existMember = memberData.find(member => member.nationalId == newMember.nationalId)
    if (existMember) {
     return   res.json(" Member is already exist")
    } else{
        memberData.push(newMember)
        fs.writeFileSync("member.json", JSON.stringify(memberData));
        res.json({msg : "Added Member successfully" , memberData});
    };
});

// ! Get a specific Member (if his membership expired return “this member is not allowed to enter the gym”)
app.get("/getmember/:id",(req,res,next)=>{
    const currentDate = new Date();

    const index = memberData.findIndex((e)=>{
        return e.id == req.params.id
     });
     if (index == -1) {
         res.json("User Not Found")
    } 
    else{
        if (memberData.memberShip.to === currentDate.getFullYear()) {
            res.json("this member is not allowed to enter the gym")
        }
        else{
            res.json(memberData[index]);
        }
    }
})

// !Update Member (name, membership, trainer id)
app.put("/member/:id",(req,res,next)=>{
    const {name, membership, trainerId} = req.body;
    const index = memberData.findIndex((e)=>{
       return e.id == req.params.id
    });
    if (index == -1) {
        return res.json("User Not Found")
    }else{
    memberData[index].name = name;
    memberData[index].memberShip = membership;
    memberData[index].trainerId = trainerId;
    }
    fs.writeFileSync("member.json", JSON.stringify(memberData));

    res.json({msg: "update member",memberData});
})

// ! Delete Member
app.delete("/member/:id",(req,res,next)=>{
   const index = memberData.findIndex((e)=>{
    return e.id == req.params.id;
   });

   if (index == -1) {
    return res.json("Member not found")
   } 
   else{
   memberData.splice(index, 1);
}
fs.writeFileSync("member.json", JSON.stringify(memberData));
res.json({msg : "deleted",memberData})
})
//! add trainer must be unique
app.post("/addtrainer",(req,res,next)=>{
    let newTrainer = req.body;

    let existTrainer = trainerData.find(trainer => trainer.id == newTrainer.id);
    if (existTrainer) {
     return res.json(" Member is already exist")
    } else{
        trainerData.push(newTrainer)
        fs.writeFileSync("trainer.json", JSON.stringify(trainerData));
        res.json({msg : "Added Tariner successfully" , trainerData});
    };
});

// !Update trainer (name, duration)
app.put("/trainer/:id",(req,res,next)=>{
    const {name, duration} = req.body;
    const index = trainerData.findIndex((e)=>{
       return e.id == req.params.id
    });
    if (index == -1) {
        return res.json("User Not Found")
    }else{
    trainerData[index].name = name;
    trainerData[index].duration = duration;
    }
    fs.writeFileSync("trainer.json", JSON.stringify(trainerData));

    res.json({msg: "update trainer",trainerData});
})
// ! Delete trainer
app.delete("/trainer/:id",(req,res,next)=>{
    const index = trainerData.findIndex((e)=>{
     return e.id == req.params.id;
    });
 
    if (index == -1) {
     return res.json("Trainer not found")
    } 
    else{
    trainerData.splice(index, 1);
 }
 fs.writeFileSync("trainer.json", JSON.stringify(trainerData));
 res.json({msg : "deleted",trainerData})
 })
// ! Get all trainers and trainer’s members.
app.get("/", (req,res,next)=>{
    res.json({memberData,trainerData})
});
//! Get a specific trainer and trainer’s members
app.get("/trainer/:id", (req,res,next)=>{
    const index = memberData.findIndex((e)=>{
        return e.id == req.params.id
     });
    const index2 = trainerData.findIndex((e)=>{
        return e.id == req.params.id
     });
     if (index == -1 ) {
         return res.json("User Not Found")
     } else if (index2 == -1) {
        return res.json("User Not Found")
       }
    
});

app.use("*",(req,res,next)=>{
    res.json({msg : "404 Not Found"});
});

app.listen(3000,()=>{
   console.log(" server listening on");
});





