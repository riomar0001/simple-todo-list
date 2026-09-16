import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function TodoItem({ todo, onDelete }) {
  return (
    <li className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent">
      <span className="flex-1 text-sm">{todo.title}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.title}`}
      >
        <Trash2 />
      </Button>
    </li>
  )
}
