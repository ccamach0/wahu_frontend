# 📚 Documentación de Componentes - Wahu

## Componentes de UX Mejorada

### ConfirmModal
Modal de confirmación para acciones destructivas.
```jsx
import ConfirmModal from '@/components/ConfirmModal';

<ConfirmModal
  isOpen={open}
  title="Eliminar imagen"
  message="¿Estás seguro?"
  confirmText="Sí, eliminar"
  severity="danger"
  loading={isDeleting}
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

### FormInput
Input mejorado con validación visual.
```jsx
import FormInput from '@/components/FormInput';

<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  success={email && !errors.email ? "Email válido" : undefined}
  required
  showPasswordToggle={false}
/>
```

### Toast
Notificaciones emergentes.
```jsx
import Toast from '@/components/Toast';

<Toast
  isOpen={true}
  message="¡Acción completada!"
  type="success"
  duration={3000}
  onClose={handleClose}
/>
```

### CommentThread
Sistema de comentarios anidados.
```jsx
import CommentThread from '@/components/CommentThread';

<CommentThread
  comments={comments}
  onAddComment={handleAdd}
  onDeleteComment={handleDelete}
  onAddReply={handleReply}
  currentUserId={userId}
  maxDepth={2}
/>
```

## Componentes de Presentación

### Badge
Etiquetas versátiles.
```jsx
import Badge, { CategoryBadge, StatusBadge } from '@/components/Badge';

<Badge variant="primary">Personalidad</Badge>
<CategoryBadge category="Salud" />
<StatusBadge status="active" />
```

### Card
Contenedores de contenido.
```jsx
import Card, { CardGrid } from '@/components/Card';

<Card
  title="Mi Tarjeta"
  subtitle="Subtítulo opcional"
  actions={[{ label: 'Editar', onClick: handleEdit }]}
>
  Contenido
</Card>

<CardGrid columns={3}>
  <Card>...</Card>
  <Card>...</Card>
</CardGrid>
```

### DataTable
Tabla de datos mejorada.
```jsx
import DataTable from '@/components/DataTable';

<DataTable
  columns={[
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' }
  ]}
  data={items}
  sortable={true}
  actions={[{ key: 'edit', label: 'Editar' }]}
  onAction={handleAction}
/>
```

### Pagination
Paginación profesional.
```jsx
import Pagination from '@/components/Pagination';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  loading={isLoading}
/>
```

### Tabs
Navegación por pestañas.
```jsx
import Tabs, { TabsVertical } from '@/components/Tabs';

<Tabs
  tabs={[
    { label: 'General', icon: '⚙️', content: <General /> },
    { label: 'Avanzado', badge: '3', content: <Advanced /> }
  ]}
  defaultTab={0}
/>
```

### SearchBar
Búsqueda avanzada con filtros.
```jsx
import SearchBar from '@/components/SearchBar';

<SearchBar
  placeholder="Buscar mascotas..."
  value={query}
  onChange={setQuery}
  filters={[{ key: 'species', label: 'Especie', type: 'select' }]}
  onFilterChange={handleFilter}
  suggestions={suggestions}
/>
```

### Modal
Modal genérico reutilizable.
```jsx
import Modal from '@/components/Modal';

<Modal
  isOpen={isOpen}
  title="Mi Modal"
  size="md"
  onClose={handleClose}
  actions={[
    { label: 'Cancelar', onClick: handleCancel },
    { label: 'Guardar', primary: true, onClick: handleSave }
  ]}
>
  Contenido
</Modal>
```

## Componentes de Presentación Especializados

### Avatar
Avatares de usuarios.
```jsx
import Avatar, { AvatarGroup } from '@/components/Avatar';

<Avatar 
  src={imageUrl}
  name="Juan Pérez"
  size="md"
  status="online"
/>

<AvatarGroup
  avatars={[...]}
  max={3}
/>
```

### Rating
Sistema de calificaciones.
```jsx
import Rating, { RatingDisplay } from '@/components/Rating';

<Rating
  value={rating}
  onChange={setRating}
  size="lg"
  allowHalf={true}
/>

<RatingDisplay rating={4.5} count={128} />
```

### EmptyState
Estados vacíos.
```jsx
import EmptyState, { NoDataEmpty } from '@/components/EmptyState';

<EmptyState
  title="Sin resultados"
  message="Intenta otra búsqueda"
  action={handleRetry}
/>

<NoDataEmpty action={handleCreate} />
```

### LoadingSpinner
Componentes de carga.
```jsx
import LoadingSpinner, { 
  Spinner, 
  SkeletonCard, 
  SkeletonGallery 
} from '@/components/LoadingSpinner';

<Spinner size="lg" color="wahu" />
<SkeletonCard />
<SkeletonGallery count={6} />
```

## Otros Componentes

### ErrorBoundary
Capturador global de errores.
```jsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### ToastProvider
Proveedor global de notificaciones.
```jsx
import { ToastProvider, useToastContext } from '@/components/ToastProvider';

<ToastProvider>
  <YourApp />
</ToastProvider>

// Dentro de componentes:
const { success, error, warning } = useToastContext();
```

## Hooks

### useForm
Manejo de formularios.
```jsx
import { useForm } from '@/hooks/useForm';

const form = useForm(
  { email: '', password: '' },
  handleSubmit,
  validate
);

<input {...form.bind} />
<p>{form.errors.email}</p>
```

### useToastContext
Acceso global a toasts.
```jsx
import { useToastContext } from '@/components/ToastProvider';

const { success, error, info } = useToastContext();
success('¡Acción completada!');
```

## Utilidades

### helpers.js
50+ funciones útiles:
- formatDate, formatTime, formatRelativeTime
- validateEmail, validateUsername, validatePassword
- truncate, capitalize, slugify
- groupBy, unique, sortBy, chunk
- debounce, throttle, retry, delay

### validators.js
Validadores componibles:
- required, email, username, password
- minLength, maxLength, number, url
- custom, compose
- createFormValidator

## Ejemplos de Uso Completo

### Formulario con Validación
```jsx
import { useForm } from '@/hooks/useForm';
import FormInput from '@/components/FormInput';
import { validators } from '@/utils/validators';

const validate = validators.createFormValidator({
  email: validators.compose(validators.required, validators.email),
  password: validators.compose(validators.required, validators.password)
});

const form = useForm({ email: '', password: '' }, handleSubmit, validate);

return (
  <form onSubmit={form.handleSubmit}>
    <FormInput
      label="Email"
      {...form.bind.email}
      error={form.errors.email}
    />
    <button type="submit" disabled={form.isSubmitting}>
      Enviar
    </button>
  </form>
);
```

### Tabla con Datos
```jsx
import DataTable from '@/components/DataTable';

<DataTable
  columns={[
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Estado', render: (row) => <Badge>{row.status}</Badge> }
  ]}
  data={users}
  actions={[
    { key: 'edit', label: 'Editar', className: 'bg-blue-100 text-blue-700' },
    { key: 'delete', label: 'Eliminar', className: 'bg-red-100 text-red-700' }
  ]}
  onAction={(action, row) => {
    if (action === 'edit') handleEdit(row);
    if (action === 'delete') handleDelete(row);
  }}
/>
```

---

**Última actualización:** 2026-04-23
**Versión:** 1.0.0
