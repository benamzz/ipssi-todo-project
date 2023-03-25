const express = require('express')

const router = express.Router()
const authMiddleware = require('../middlewares/isAuthenticated')
const List = require('../models/list.model')
const Todo = require('../models/todo.model')

// Get all lists
router.get('/', authMiddleware, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user._id })
    res.json(lists)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// Get list by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, user: req.user._id })
    if (!list) {
      return res.status(404).json({ msg: 'List not found' })
    }
    res.json(list)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// Create list
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body
  try {
    const listExists = await List.findOne({ name, user: req.user._id })
    if (listExists) {
      return res.status(400).json({ msg: 'List already exists' })
    }
    const newList = new List({
      name,
      user: req.user._id
    })
    await newList.save()
    res.json(newList)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// Update list by id
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const list = await List.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
      new: true,
      runValidators: true
    })
    if (!list) {
      return res.status(404).json({ msg: 'List not found' })
    }
    res.json(list)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// Delete list by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const list = await List.findOne({ _id: req.params.id, user: req.user._id })
      if (!list) {
        return res.status(404).json({ msg: 'List not found' })
      }
      await Todo.deleteMany({ listId: req.params.id })
      await List.deleteOne({ _id: req.params.id })
      res.json({ msg: 'List removed' })
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  })
  

module.exports = router