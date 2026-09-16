export function TodoStats({ todos }) {
  return (
    <p className="text-sm text-muted-foreground">
      {todos.length} {todos.length === 1 ? 'item' : 'items'}
    </p>
  )
}
