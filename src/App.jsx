import { useEffect, useState } from 'react'

import { TodoForm } from '@/components/TodoForm'
import { TodoList } from '@/components/TodoList'
import { TodoStats } from '@/components/TodoStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STORAGE_KEY = 'todos'


function App() {

  const [todos, setTodos] = useState([])


  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

    document.title = todos.length > 0 ? `(${todos.length}) Todos` : 'Todos'
  }, [todos])

  function addTodo(title) {
    setTodos([...todos, { id: Date.now(), title }])
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Todo List</CardTitle>
          <TodoStats todos={todos} />
        </CardHeader>

        <CardContent className="space-y-4">
          <TodoForm onAdd={addTodo} />
          <TodoList todos={todos} onDelete={deleteTodo} />
        </CardContent>
      </Card>
    </main>
  )
}

export default App
