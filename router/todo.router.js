const express = require('express');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const Todo = require('../models/todo.model');
const List = require('../models/list.model');

// Get all todos for a list
router.get('/lists/:listId/todos', async (req, res) => {
  try {
    const todos = await Todo.find({ list: req.params.listId });
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// Get all completed todos
router.get('/todos/completed', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id, completed: true });
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Create a new todo in a specific list
router.post(
  '/lists/:listId/todos',
  [
    body('description', 'Descrition is required').not().isEmpty(),
    body('details', 'details is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { description, dueDate } = req.body;

    try {
      const list = await List.findById(req.params.listId);
      if (!list) {
        return res.status(404).json({ msg: 'List not found' });
      }

      // Check if a todo with the same name already exists in the list
      const existingTodo = await Todo.findOne({ description: req.body.description, list: req.params.listId });
      if (existingTodo) {
        return res.status(409).json({ msg: 'A todo with the same name already exists in this list' });
      }

      const newTodo = new Todo({
        description,
        dueDate,
        list: req.params.listId,
        user: req.user.id,
      });

      await newTodo.save();

      res.status(201).json(newTodo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update a todo by id
router.patch('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

   const { description, dueDate, completed } = req.body;
   todo.description = description;
   todo.dueDate = dueDate;
   todo.completed = completed;
   const updatedTodo = await todo.save();
   res.json(updatedTodo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Delete a todo by id
router.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

    await Todo.deleteOne({ _id: req.params.id });

    res.status(200).json({ msg: 'Todo deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
