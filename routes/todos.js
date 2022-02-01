import express from 'express';
import ToDo from '../models/ToDo.js';
import validateToDoInput from '../validation/toDoValidation.js';
import requiresAuth from '../middleware/permissions.js';
const router = express.Router();

// @route   GET /api/todos/test
// @desc    Test the todos route
// @access  Public
router.get('/test', (req, res) => {
  res.send(`ToDo's route working`);
});

// @route   POST /api/todos/new
// @desc    Create a new todo
// @access  Private
router.post('/new', requiresAuth, async (req, res) => {
  try {
    const { isValid, errors } = validateToDoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    // create a new todo
    const newToDo = new ToDo({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // save the new todo
    await newToDo.save();
    return res.json(newToDo);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   GET /api/todos/current
// @desc    Current users todos
// @access  Private
router.get('/current', requiresAuth, async (req, res) => {
  try {
    const completeToDos = await ToDo.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    const incompleteToDos = await ToDo.find({
      user: req.user._id,
      complete: false,
    }).sort({ createdAt: -1 });

    return res.json({ incomplete: incompleteToDos, complete: completeToDos });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   PUT /api/todos/:toDoId/complete
// @desc    Mark a todo as complete
// @access  Private
router.put('/:toDoId/complete', requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: 'Could not find ToDo' });
    }

    if (toDo.complete) {
      return res.status(400).json({ error: 'ToDo is already complete' });
    }

    const updatedToDo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );
    return res.json(updatedToDo);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   PUT /api/todos/:toDoId/incomplete
// @desc    Mark a todo as incomplete
// @access  Private
router.put('/:toDoId/incomplete', requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: 'Could not find ToDo' });
    }

    if (!toDo.complete) {
      return res
        .status(400)
        .json({ error: 'ToDo has already been marked as incomplete' });
    }

    const updatedToDo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        complete: false,
        completedAt: null,
      },
      {
        new: true,
      }
    );
    return res.json(updatedToDo);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   PUT /api/todos/:toDoId
// @desc    Update a todo
// @access  Private
router.put('/:toDoId', requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: 'Could not find ToDo' });
    }

    const { isValid, errors } = validateToDoInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedToDo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.toDoId,
      },
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );
    return res.json(updatedToDo);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   DELETE /api/todos/:toDoId
// @desc    Delete a todo
// @access  Private
router.delete('/:toDoId', requiresAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.toDoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: 'Could not find ToDo' });
    }

    await ToDo.findOneAndRemove({
      user: req.user._id,
      _id: req.params.toDoId,
    });
    return res.json({ message: 'ToDo has been deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
export default router;
