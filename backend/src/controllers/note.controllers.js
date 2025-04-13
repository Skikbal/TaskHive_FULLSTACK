import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import Note from "../models/Note.model.js";
import { asyncHandler } from "../utils/async-handler.js";

//get all notes
const getNotesHandler = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  if (!notes) {
    throw new ApiError(404, "Notes not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Notes fetched successfully", notes));
});

//get note by id
const getNoteByIdHandler = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Note fetched successfully", note));
});

const createNote = asyncHandler(async (req, res) => {
  const _id = req.user._id;
  const { content, projectId } = req.body;

  const newNote = await Note.create({
    project:projectId,
    createdBy:_id,
    content
  })

  if(!newNote){

  }

  return res.status(201).json(new ApiResponse(201,""))
  
});
const updateNote = asyncHandler(async (req, res) => {});

const deleteNote = asyncHandler(async (req, res) => {});

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
