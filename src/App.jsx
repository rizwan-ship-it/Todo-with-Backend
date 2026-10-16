import React, { useEffect, useState } from 'react'
import Todo from './Todo'
import axios from 'axios'
import { useRef } from 'react'

function App () {
  const [todo, setTodo] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoadding] = useState(true)

  // Pagination Concept
  const [limit, setLimit] = useState(20)
  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Search Query
  const [search, setSearch] = useState('')
  const searchQueryRef = useRef('')
  // ================================================================
  // Edit and post data model
  const [isModelOpen, setIsModelOpen] = useState(false)
  // ================================Edit todo Id ============================================
  const [editTodoid, setEditTodoId] = useState(null)

  const fetchTodoData = async () => {
    try {
      const TODO_URL = `http://localhost:8000/todo?search=${search}&page=${pages}&limit=${limit}`
      const response = await axios.get(TODO_URL)
      console.log('response', response.data.todoDetails)
      const todoDocumentsCount = response.data.todoCountDocuments
      const todo = response.data.todoDetails
      const totalPages = Math.ceil(todoDocumentsCount / limit)

      setTotalPages(totalPages)
      setTodo(todo)
      setIsLoadding(false)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoadding(false)
    }
  }
  // =========================handle Pagination=====================================================
  const handlePagination = page => {
    setPages(page)
  }

  // handle Page Change Limit
  const handlePageChangeLimit = e => {
    const value = e.target.value
    setLimit(value)
  }
  // search Query
  const handleSearchQuery = () => {
    const value = searchQueryRef.current.value
    setSearch(value)
  }
  // Add todo
  const handleAddTodo = async () => {
    setIsModelOpen(true)
  }

  const handleAddtodoForm = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/todo`, todoForm)
      console.log(response)
      if (response.status === 201) {
        alert('Todo created Successfully✔️ ')
        setTodoForm(initilizeTodoForm)
        isModelOpen(false)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  //Handle Delete
  const handleDeleteTodo = async todoId => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/todo/${todoId}`
      )
      console.log('response', response.data)
      alert('Todo Deleted Successfully')
      fetchTodoData()
    } catch (error) {
      console.log('Error', error)
    }
  }
  // ============================Update todo===========================
  const initilizeTodoForm = {
    title: '',
    description: ''
  }
  
  const [todoForm, setTodoForm] = useState(initilizeTodoForm)

  const handleChnageInput = e => {
    const value = e.target.value
    const name = e.target.name
    setTodoForm(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateTodoForm = async e => {
    try {
      const response = await axios.put(
        `http://localhost:8000/todo/${editTodoid}`,
        todoForm
      )
      console.log('response', response)
      if (response.status === 200) {
        alert('todo Updated Successfully👍')
      }
      setEditTodoId(null)
      fetchTodoData()
      setTodoForm(initilizeTodoForm)
    } catch (error) {
      console.log('error', error)
    }

    e.preventDefault()
  }

  const handleTodoEdit = async todoId => {
    try {
      const response = await axios.get(`http://localhost:8000/todo/${todoId}`)
      const { _id: id, title, description } = response.data.todos
      setEditTodoId(id)
      setIsModelOpen(true)
      setTodoForm({
        title: title,
        description: description
      })
    } catch (error) {
      console.log('errror', error)
    }
  }

  // =========================close Model=======================
  const handleCloseModel = () => {
    setIsModelOpen(false)
    setEditTodoId(null)
    setTodoForm(initilizeTodoForm)
  }
  useEffect(() => {
    fetchTodoData()
  }, [pages, limit, search])

  if (error) {
    return <h1>{error}</h1>
  }

  if (isLoading) {
    return <h1>Loading</h1>
  }

  return (
    <div className='bg-gray-950 h-full'>
      <div className='flex justify-center items-center'>
        <input
          ref={searchQueryRef}
          type='text'
          name='search'
          id='search'
          className='border border-slate-600 w-6/12 py-2 px-4 outline-none m-10 rounded text-gray-400 font-bold text-xl '
          placeholder='search using title....'
        />
        <div className='flex gap-5'>
          <button
            onClick={handleSearchQuery}
            className='bg-violet-700 outline-none px-4 py-2 rounded active:scale-97 text-xl font-bold text-gray-200 cursor-pointer '
          >
            Serach
          </button>
          <button
            onClick={handleAddTodo}
            className={`bg-blue-700 outline-none px-4 py-2 rounded active:scale-97 text-xl font-bold text-gray-200 cursor-pointer`}
          >
            Add Todo
          </button>
        </div>
      </div>
      {/*  ============================Todo card ==============================================================================*/}
      <div className='grid grid-cols-3 gap-5'>
        {todo.map((todo, i) => {
          const { _id: id, title, description } = todo
          return (
            <div className='h-full' key={i}>
              <div className=' bg-gray-900 w-auto p-5 rounded space-y-2.5  '>
                {/* Title As a question */}
                <h1 className='text-2xl font-medium text-gray-200'>{title} </h1>
                <p className='text- xl font-medium text-gray-200 line-clamp-2'>
                  {description}
                </p>
                <div className='space-x-2.5'>
                  <button
                    onClick={() => handleTodoEdit(id)}
                    className='bg-green-800 px-4 py-1 rounded text-white font-bold cursor-pointer'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(id)}
                    className='bg-red-800 px-4 py-1 rounded text-white font-bold cursor-pointer'
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* ======================= */}
      <div className='grid grid-cols-3 p-4 gap-5 items-stretch'>
        {todo.map(data => {
          return <Todo key={data._id} data={data} />
        })}
      </div>
      {/* =====================Pages for pagination==================== */}
      <div className='flex justify-center items-center '>
        <div className='flex gap-5 justify-center  mb-10'>
          {Array(totalPages)
            .fill(0)
            .map((ele, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handlePagination(index + 1)}
                  className={` text-xl text-white py-1 px-3 rounded cursor-pointer ${
                    index + 1 == pages
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
        </div>
        {/* Content Limit  */}
        <div className='flex justify-around mb-10'>
          <label
            htmlFor='page limit'
            className='text-white font-bold px-5 py-2'
          >
            Page limit per pages
          </label>
          <select
            onChange={handlePageChangeLimit}
            className='border w-20 h-10 rounded bg-gray-800 text-white font-bold'
            name='limit'
            id='limit'
          >
            <option value=''>{limit}</option>
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='40'>40</option>
            <option value='50'>50</option>
          </select>
        </div>
      </div>
      {/* model pop-Up */}
      <div
        className={`${
          !isModelOpen && 'hidden'
        } bg-black/70 fixed top-0 left-0 w-full min-h-screen`}
      >
        <section
          className={` flex flex-col gap-4 bg-white px-5 py-10 w-5/12 absolute top-[20%] left-[30%] rounded-lg`}
        >
          <div>
            <button
              onClick={handleCloseModel}
              className='bg-red-700 py-1 px-3 text-white font-bold  absolute top-3 left-3 rounded-full cursor-pointer '
            >
              X
            </button>
          </div>
          <form
            className={`flex flex-col gap-3`}
            onSubmit={editTodoid ? handleUpdateTodoForm : handleAddtodoForm}
          >
            <div className='flex flex-col'>
              <label
                htmlFor='title'
                id='title'
                className='text-xl text-gray-800 font-bold'
              >
                Title
              </label>
              <input
                type='text'
                name='title'
                value={todoForm.title}
                onChange={handleChnageInput}
                id='title'
                className='w-full outline-blue-300 border-slate-200 border-2 px-4 py-2 rounded-md'
                placeholder='Enter your title'
                required
              />
            </div>
            <div className='flex flex-col gap-3'>
              <label
                htmlFor='description'
                className='text-xl text-gray-800 font-bold'
              >
                Description
              </label>
              <textarea
                type='text'
                rows={4}
                name='description'
                value={todoForm.description}
                onChange={handleChnageInput}
                id='description'
                className='w-full outline-blue-300 border-slate-200 border-2 px-4 py-2 rounded-md'
                placeholder='Enter your title'
                required
              />
            </div>
            <div className='flex justify-center'>
              <button
                className={` ${
                  editTodoid ? 'bg-green-700' : 'bg-blue-700'
                }  text-white font-bold rounded-md outline-none active:scale-97 px-4 py-2 cursor-pointer w-1/2`}
              >
                {editTodoid ? 'Updated todo' : 'Add todo'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default App
