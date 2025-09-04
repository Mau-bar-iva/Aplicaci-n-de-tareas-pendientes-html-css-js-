// --- CREATE ---
function createUser(newUser) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
}

// --- READ ---
function readUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// --- UPDATE ---
function updateUser(id, updatedData) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(user =>
    user.id === id ? { ...user, ...updatedData } : user
  );
  localStorage.setItem("users", JSON.stringify(users));
}

// --- DELETE ---
function deleteUser(id) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter(user => user.id !== id);
  localStorage.setItem("users", JSON.stringify(users));
}

// Crear usuarios
createUser({ id: 1, name: "Mauricio", email: "mau@example.com" });
createUser({ id: 2, name: "Ana", email: "ana@example.com" });

// Leer usuarios
console.log(readUsers());

// Actualizar usuario
updateUser(1, { name: "Mauricio Editado" });

// Eliminar usuario
deleteUser(2);

// Ver resultado final
console.log(readUsers());

// Notas
//los valores dentro del localStorage siempre son string, por lo que si queremos guardar objetos o arrays debemos convertirlos a string con JSON.stringify() y al leerlos debemos convertirlos de nuevo a su tipo original con JSON.parse().
//se recomienda guardar los datos como key: users y value: [{object1}, {object2}] en lugar de guardar cada usuario con una key individual como user1, user2, etc., ya que esto facilita la gestión y manipulación de los datos.