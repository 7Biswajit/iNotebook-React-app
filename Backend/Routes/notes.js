const express = require('express')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require("../models/Notes");
 const { body, validationResult } = require("express-validator");


 //ROUTE 1 :Get All Notes using :GET "/api/notes/fetchallnotes"log in required
 router.get('/fetchallnotes',fetchuser,async(req,res)=>{
     try {
       const notes = await Notes.find({user:req.user.id});
       res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("intenal server error")
    }
    
})
 //ROUTE 2 :Add New Note   using :POST "/api/notes/addnotes"log in required
  router.post('/addnote',fetchuser,[
      body('title','Enter a valid title').isLength({min:5}),
      body('description','Description must be atleast 5 characters').isLength({min:5}),],async(req,res)=>{
          try {
         const{title,description,tag}=req.body;
          //if there are errors,returns Bad request and the arrors
          const errors = validationResult(req);
          if(!errors.isEmpty()){
             return res.status(400).json({errors:errors.array()});
          }
          const note =new Notes({
              title,description,tag,user:req.user.id
          })
          const savedNotes = await note.save()


          res.json(savedNotes)
      } catch (error) {
         console.error(error.message);
          res.status(500).send("some error occured"); 
      }
  })

  //ROUTE 3 :Update The Existing  Note   using :PUT "/api/notes/updatenote"log in required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const{title,description,tag}=req.body;
    //Create a new note
    const newNotes = {};
    if(title){newNotes.title=title};
    if(description){newNotes.description=description};
    if(tag){newNotes.tag=tag};

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}


    if(note.user.toString() !==req.user.id){
        return res.status(401).send("not allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true})
    res.json({note});
})

//ROUTE 3 :Delete The Existing  Note   using :DELETE "/api/notes/deletenote"log in required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
        //Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

//Allow deletion if the user owns this notes
    if(note.user.toString() !==req.user.id){
        return res.status(401).send("not allowed")
    }
    note = await Notes.findByIdAndDelete(req.params.id)
res.json({'success':"Note hs been deleted",  note:note})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured"); 
    }
    
})  

    
    

    

module.exports = router