import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, setFilter } from '../store';

const TodoApp = () => {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { items, filter, maxLength } = useSelector((state) => state.todos);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && text.length <= maxLength) {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  const filteredItems = items.filter((item) => {
    // Search filter
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Category filter
    if (filter === 'completed') return item.completed;
    if (filter === 'active') return !item.completed;
    return true;
  });

  const filterOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Текущие', value: 'active' },
    { label: 'Выполненные', value: 'completed' }
  ];

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '600px', borderRadius: '1.25rem' }}>

        <div className="card-header bg-white border-0 pt-4 pb-3 px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0 text-primary">Мои задачи</h3>
            <div>
              <span className="badge bg-primary-subtle text-primary rounded-pill pr-2 mr-1 py-2">
                {items.length} всего
              </span>
              <span className="badge bg-primary-subtle text-primary rounded-pill py-2">
                {items.filter(item => !item.completed).length} текущие
              </span>
            </div>
          </div>

          <div className="row g-3 align-items-center mb-4">
            <div className="col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <i className="bi bi-search">🔍</i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm border-start-0"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap gap-1 justify-content-md-end">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => dispatch(setFilter(opt.value))}
                    className={`btn btn-sm rounded-pill px-2 transition-all ${filter === opt.value
                      ? 'btn-primary shadow-sm'
                      : 'btn-outline-secondary border-0 text-muted bg-light'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
              <input
                type="text"
                className={`form-control border-0 py-3 ps-4 ${text.length > maxLength ? 'is-invalid' : ''}`}
                placeholder="Что нужно сделать?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ fontSize: '1.1rem' }}
              />
              <button
                className="btn btn-primary px-4 border-0"
                type="submit"
                disabled={!text.trim() || text.length > maxLength}
              >
                <span className="fs-4 fw-bold">+</span>
              </button>
            </div>
            {text.length > 0 && (
              <div className={`mt-2 ps-2 small ${text.length > maxLength ? 'text-danger' : 'text-muted'}`}>
                {text.length} / {maxLength}
              </div>
            )}
          </form>
        </div>

        <div className="card-body px-4 pb-4">
          <div className="list-group list-group-flush">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => dispatch(toggleTodo(item.id))}
                  className={`list-group-item list-group-item-action d-flex align-items-center border-0 rounded-3 mb-2 p-3 transition-all ${item.completed ? 'bg-light opacity-75' : 'bg-white shadow-sm'
                    }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`rounded-circle border me-3 d-flex align-items-center justify-content-center transition-all ${item.completed ? 'bg-success border-success text-white' : 'border-secondary'
                    }`} style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                    {item.completed && <small>✓</small>}
                  </div>
                  <span className={`text-break ${item.completed ? 'text-decoration-line-through text-muted' : 'text-dark fw-medium'}`}>
                    {item.text}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-muted">
                <div className="mb-2 fs-2">📋</div>
                <p className="mb-0">Задач не найдено</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-footer bg-transparent border-0 text-center pb-4 pt-0">
          <small className="text-muted">Нажмите на задачу, чтобы изменить статус</small><br></br>
          <small className="text-muted">Работа выполнена: Маснавеев Камиль Альбертович</small><br></br>
          <small className="text-blue" mailto="kmasnaveev@gmail.com">kmasnaveev@gmail.com</small>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
