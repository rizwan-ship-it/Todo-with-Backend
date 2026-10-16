import React from 'react'

function Todo ({ data }) {
  const { _id: id, title, description } = data
  return (
    // <div className='h-full'>
    //   <div className=' bg-gray-900 w-auto p-5 rounded space-y-2.5  '>
    //     {/* Title As a question */}
    //     <h1 className='text-2xl font-medium text-gray-200'>{title} </h1>
    //     <p className='text- xl font-medium text-gray-200 line-clamp-2'>
    //       {description}
    //     </p>
    //     <div className='space-x-2.5'>
    //       <button className='bg-green-800 px-4 py-1 rounded text-white font-bold cursor-pointer'>
    //         Edit
    //       </button>
    //       <button className='bg-red-800 px-4 py-1 rounded text-white font-bold cursor-pointer'>
    //         delete
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div>
      
    </div>
  )
}

export default Todo
