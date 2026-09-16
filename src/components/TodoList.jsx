import { TodoItem } from '@/components/TodoItem'

export function TodoList({ todos, onDelete }) {
  if (todos.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nothing here yet. Add your first todo above.
      </p>
    )
  }

  return (
    <ul className="space-y-1">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </ul>
  )
}
