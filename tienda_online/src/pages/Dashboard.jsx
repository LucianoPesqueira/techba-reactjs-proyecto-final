import { useState, useMemo, useEffect } from 'react';
import { Package, Plus, Search, DollarSign, Edit, Trash2, List, Layers, CheckCircle, Menu, TextCursorInput, CircleCheckBig, ImageUp } from 'lucide-react';

import { useProductContext } from '../context/ProductosContext';
import { useDocumentHead } from '../hooks/useDocumentHead';

// --- Componente de la Barra Desplegable con 'offcanvas' y 'show'---
const Sidebar = ({ activeItem, setActiveItem, isOpen, onClose }) => {
    return (
        <>
            <div 
                className={`offcanvas offcanvas-start bg-dark text-white ${isOpen ? 'show' : ''}`}
                tabIndex="-1"
                id="sidebarOffcanvas"
                aria-labelledby="sidebarLabel"
                style={{ width: '250px' }}
            >
                <div className="offcanvas-header border-bottom border-secondary">
                    <h5 className="offcanvas-title fs-5 fw-bold text-uppercase" id="sidebarLabel">
                        <div className="p-2 bg-primary rounded-circle text-white shadow-sm me-2 d-inline-block">
                            <Package className="h-5 w-5" />
                        </div>
                        Dashboard 
                    </h5>
                    <button 
                        type="button" 
                        className="btn-close text-reset btn-close-white" 
                        onClick={onClose} 
                        aria-label="Cerrar"
                    ></button>
                </div>
                <div className="offcanvas-body d-flex flex-column p-3">
                    <nav className="flex-grow-1">
                        <ul className="nav nav-pills flex-column mb-auto">
                            <SidebarItem
                                icon={<List className="h-4 w-4 me-2" />}
                                text="Productos"
                                isActive={activeItem === 'products'}
                                onClick={() => { setActiveItem('products'); onClose(); }}
                            />
                            <SidebarItem
                                icon={<Layers className="h-4 w-4 me-2" />}
                                text="Categorías"
                                isActive={activeItem === 'categories'}
                                onClick={() => { setActiveItem('categories'); onClose(); }}
                            />
                            <SidebarItem
                                icon={<DollarSign className="h-4 w-4 me-2" />}
                                text="Ventas"
                                isActive={activeItem === 'sales'}
                                onClick={() => { setActiveItem('sales'); onClose(); }}
                            />
                        </ul>
                    </nav>
                </div>
            </div>
            {/* Backdrop manual para el offcanvas cuando está abierto, asegurando que se oculte en desktop (d-lg-none) si fuera fijo */}
            {isOpen && (
                <div className="offcanvas-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>
            )}
        </>
    );
};

// --- Los elementos del offcanvas sidebar ---
const SidebarItem = ({ icon, text, isActive, onClick }) => (
    <li className="nav-item mb-2">
        <button
            onClick={onClick}
            className={`btn w-100 text-start d-flex align-items-center transition-all ${
                isActive
                    ? 'btn-primary text-white shadow'
                    : 'btn-dark text-secondary hover:text-white'
            }`}
        >
            {icon}
            {text}
        </button>
    </li>
);

// --- Componente del Modal para Agregar/Editar Producto ---
const ProductModal = ({ isOpen, onClose, product, onSave }) => {
    const [formCategorias, setFormCategorias] = useState(['Adventure', 'Platform', 'Indie', 'Shooter', 'Role-playing', 'Simulator', 'Sport', 'Racing', 'Arcade', 'Fighting']);
    const [formPlataformas, setFormPlataformas] = useState(['PC', 'juegos ps4', 'juegos ps5']);
    const [formEstado, setFormEstado] = useState(['Activo', 'Inactivo', 'Agotado']);
    const [showContent, setShowContent] = useState(false);
    
    const [formData, setFormData] = useState(product || { nombre: '', categoria: [], plataforma: [], imagen: '', precio: 0, stock: 0, descripcion: '', estado: '' });
    const isEditing = !!product;
    

    useEffect(() => {
        setFormData(product || { nombre: '', categoria: [], plataforma: [], imagen: '', precio: 0, stock: 0, descripcion: '', estado: '' });
        if (isOpen) {
           setTimeout(() => setShowContent(true),0);
        } else {
              setShowContent(false);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        // Modal Backdrop y Contenedor
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1055 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4 shadow-lg">

                    {showContent && (
                        <>
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h5>
                                <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <InputField label="Nombre del Producto" name="nombre" value={formData.nombre} onChange={handleChange} icon={Package} required />
                                    <CheckBoxField label="Categorías" name="categoria" value={formData.categoria} onChange={handleChange} icon={CircleCheckBig} options={formCategorias} required />
                                    <CheckBoxField label="Plataformas" name="plataforma" value={formData.plataforma} onChange={handleChange} icon={CircleCheckBig} options={formPlataformas} required />
                                    <InputField label="URL imagen" name="imagen" value={formData.imagen} onChange={handleChange} icon={ImageUp} required />
                                    <InputField label="Precio ($)" name="precio" value={formData.precio} onChange={handleChange} icon={DollarSign} min="0.01" step="0.01" required />
                                    <InputField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} icon={List} min="0" required />
                                    <TextboxAreaField label="Descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} icon={TextCursorInput} min="0.01" step="0.01" required />
                                    <SelectField label="Estado" name="estado" value={formData.estado} onChange={handleChange} icon={CheckCircle} options={formEstado} required />
                                </div>
                                <div className="modal-footer d-flex justify-content-end">
                                    <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary shadow-sm"
                                    >
                                        {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Componentes Reutilizables para Campos de Formulario ---
const InputField = ({ label, name, value, onChange, icon: Icon, ...props }) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-bold">{label}</label>
        <div className="input-group">
            <span className="input-group-text"><Icon className="h-5 w-5" /></span>
            <input
                type="text"
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="form-control"
                {...props}
            />
        </div>
    </div>
);

// --- Componente para lista desplegable ---
const SelectField = ({ label, name, value, onChange, icon: Icon, options, ...props }) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-bold">{label}</label>
        <div className="input-group">
            <span className="input-group-text"><Icon className="h-5 w-5" /></span>
            <select
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="form-select"
                {...props}
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    </div>
);

{/* Componente para CheckBox Field */}
const CheckBoxField = ({ label, name, value = [], onChange, icon: Icon, options = [] }) => {

    const handleCheckboxChange = (opcion) => {
        const isChecked = value.includes(opcion);
        const updatedValue = isChecked
            ? value.filter(v => v !== opcion)
            : [...value, opcion];
        onChange({ target: { name, value: updatedValue } });
    };

    return (
        <fieldset className="mb-3 p-0 m-0 border-0">
            <legend className="form-label fw-bold d-flex align-items-center gap-2 mb-2" style={{ fontSize: "1rem" }}>
                <Icon className="h-5 w-5"/>
                {label}
            </legend>

            <div className="d-flex flex-wrap gap-3">
                {options.map((option) => (
                    <div key={option} className='form-check'>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${name}-${option}`}
                            checked={value.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                        />
                        <label htmlFor={`${name}-${option}`} className="form-check-label">{option}</label>
                    </div>
                ))}
            </div>
        </fieldset>
    );
};

{/* Componente para TextArea Field */}
const TextboxAreaField = ({ label, name, value, onChange, icon: Icon, ...props }) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-bold">{label}</label>
        <div className='input-group'>
            <span className='input-group-text'><Icon className="h-5 w-5"/></span>
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="form-control"
                rows="4"
                {...props}
            >
            </textarea>
        </div>
    </div>
);

// --- Componente de la Tabla de Productos ---
const ProductTable = ({ products, onEdit, onDelete }) => (
    <div className="card shadow-sm rounded-4">
        <div className="card-body p-0">
            {/* table-responsive hace que la tabla se desplace horizontalmente en pantallas pequeñas */}
            <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="p-3 text-center text-muted">ID</th>
                            <th className="p-3 text-center text-muted">Nombre</th>
                            <th className="p-3 text-center text-muted">Categoría</th>
                            <th className="p-3 text-center text-muted">Plataforma</th>
                            <th className="p-3 text-center text-muted">Stock</th>
                            <th className="p-3 text-center text-muted">Precio</th>
                            <th className="p-3 text-center text-muted">Estado</th>
                            <th className="p-3 text-center text-muted">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                             <tr>
                                <td colSpan="7" className="text-center text-muted p-4">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <ProductRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ProductRow = ({ product, onEdit, onDelete }) => {
    const getStatusBadge = (status) => {
        let badgeClass = 'bg-secondary';
        switch (status) {
            case 'Activo':
                badgeClass = 'bg-success';
                break;
            case 'Inactivo':
                badgeClass = 'bg-warning text-dark';
                break;
            case 'Agotado':
                badgeClass = 'bg-danger';
                break;
            default:
                badgeClass = 'bg-secondary';
        }
        return <span className={`badge ${badgeClass} text-uppercase py-2`}>{status}</span>;
    };

    return (
        <tr>
            <td className="p-3 align-middle text-sm">{product.id}</td>
            <td className="p-3 align-middle fw-bold">{product.nombre}</td>
            <td className="p-3 align-middle text-muted">{product.categoria[0]}</td>
            <td className="p-3 align-middle text-muted">{product.plataforma[0]}</td>
            <td className="p-3 align-middle text-center font-monospace">{product.stock}</td>
            <td className="p-3 align-middle text-center fw-semibold">${product.precio}</td>
            <td className="p-3 align-middle">{getStatusBadge(product.estado)}</td>
            <td className="p-3 align-middle text-center">
                <div className="btn-group" role="group">
                    <button
                        onClick={() => onEdit(product)}
                        className="btn btn-sm btn-outline-primary me-2 rounded-2"
                        title={`Editar ${product.name}`}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="btn btn-sm btn-outline-danger rounded-2"
                        title={`Eliminar ${product.name}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// --- Componente Principal de la Aplicación (Dashboard) ---

export default function Dashboard() {
    const { productos, loading, error, createProduct, updateProduct, deleteProduct} = useProductContext();

    const [isModalOpen, setIsModalOpen] = useState(false); {/* Estado para controlar la visibilidad del modal */}
    const [editingProduct, setEditingProduct] = useState(null); {/* Estado para el producto que se está editando */}
    const [searchTerm, setSearchTerm] = useState(''); {/* Estado para el término de búsqueda */}
    const [activeItem, setActiveItem] = useState('products'); {/* Estado para el ítem activo del sidebar */}
    // Nuevo estado para controlar el Sidebar desplegable
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    {/* Titulo para UX */}
    useDocumentHead({
        title: "Panel de Administración - Dashboard",
    });


    {/* Guardar producto (nuevo o editado) */}
    const handleSaveProduct = async(newProduct) => {
        try {
            if (newProduct.id) {
                // funcion de ProductosContext para actualizar producto
                await updateProduct(newProduct.id, newProduct);
            } else {
                // funcion de ProductosContext para agregar producto
                //const newId = Math.max(...productos.map(p => p.id), 1000) + 1; //forma para id numerico
                const newId = (Math.max(0, ...productos.map(p => parseInt(p.id, 10))) + 1).toString();
                await createProduct({ ...newProduct, id: newId });
            }
        } catch (err) {
            console.error("Error guardando producto:", err);
        }
    };

    {/* Editar un producto - abre el modal con los datos del producto */}
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    {/* Eliminar un producto por id pasado */}
    const handleDeleteProduct = async (id) => {
        console.log(`Intentando eliminar producto con ID: ${id}`);
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${id}? Esta acción es irreversible.`)) {
            // funcion de ProductosContext para eliminar producto
            try {
                await deleteProduct(id);
            } catch (err) {
                console.error("Error eliminando producto:", err);
            }
        }
    };

    {/* Filtrado de productos basado en el término de búsqueda */}
    const filteredProducts = useMemo(() => {
      if (!searchTerm) return productos;
      const lowerCaseSearch = searchTerm.toLowerCase();
      
      return productos.filter(product => {
        const nombre = product.nombre?.toLowerCase() || '';
        const categoria = Array.isArray(product.categoria)
          ? product.categoria.join(' ').toLowerCase()
          : product.categoria?.toLowerCase() || '';
        const id = product.id?.toString() || '';

        return (
          nombre.includes(lowerCaseSearch) ||
          categoria.includes(lowerCaseSearch) ||
          id.includes(lowerCaseSearch)
        );
      });
    }, [productos, searchTerm]);

    const handleOpenModal = () => {
        setEditingProduct(null); // Clear editing state for new product
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    // useEffect(() => {
    //     setProducts(productos);
    // }, [productos]);

    return (
        <div className="bg-light min-vh-100">
            {/* Sidebar (Ahora es un Offcanvas) */}
            <Sidebar 
                activeItem={activeItem} 
                setActiveItem={setActiveItem} 
                isOpen={isSidebarOpen} 
                onClose={closeSidebar} 
            />

            {/* Header Fijo para todas las pantallas */}
            <header className="bg-dark text-white p-3 shadow-lg" style={{ position: 'sticky', top: 0, zIndex: 1020 }}>
                <div className="d-flex justify-content-between align-items-center container-fluid mx-auto" style={{ maxWidth: '1280px' }}>
                    <div className="d-flex align-items-center">
                        <button 
                            className="btn btn-outline-light me-3 d-flex align-items-center" 
                            onClick={toggleSidebar} 
                            aria-label="Abrir Menú"
                        >
                            <Menu className="h-5 w-5 me-1" />
                            Menú
                        </button>
                        <div className="p-1 bg-primary rounded-circle text-white me-2">
                            <Package className="h-5 w-5" />
                        </div>
                        <span className="fs-5 fw-bold d-none d-sm-inline">Admin</span>
                    </div>
                </div>
            </header>

            {/* Contenedor Principal de Contenido - Aplica max-width: 1280px */}
            <div className="main-content-wrapper">
                <div 
                    className="container-fluid p-3 p-md-4" 
                    style={{ maxWidth: '1280px', margin: '0 auto' }}
                >
                    <main className="p-0">
                        <header className="mb-4 pb-2 border-bottom">
                            <h1 className="display-6 fw-bold text-dark">Administración de Productos</h1>
                            <p className="text-muted">Gestiona los detalles de los productos de tu tienda.</p>
                        </header>

                        <div className="card shadow-sm rounded-4 mb-4 p-3 p-md-4">
                            <div className="row g-3 align-items-center">
                                {/* Buscador */}
                                <div className="col-12 col-md-8">
                                    <div className="input-group">
                                        <span className="input-group-text"><Search className="h-5 w-5" /></span>
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="Buscar producto por nombre, categoría, plataforma ..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                {/* Botón Agregar */}
                                <div className="col-12 col-md-4">
                                    <button
                                        onClick={handleOpenModal}
                                        className="btn btn-primary w-100 d-flex justify-content-center align-items-center py-2"
                                    >
                                        <Plus className="h-5 w-5 me-2" />
                                        Agregar Producto
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product List/Table */}
                        <ProductTable products={filteredProducts} onEdit={handleEditClick} onDelete={handleDeleteProduct} />
                    </main>
                </div>
            </div>

            {/* Modal for Product Management */}
            <ProductModal
                isOpen={isModalOpen}/* Modal para añadir o modificar productos*/
                onClose={handleCloseModal}
                product={editingProduct}
                onSave={handleSaveProduct}
            />
        </div>
    );
}