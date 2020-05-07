const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// RENDRING DATA //
function renderCafe(doc) {
  let item = `
    <li data-id=${doc.id}>
      <div id="cross">x</div>
      <span>${doc.data().name}</span>
      <span>${doc.data().city}</span>
    </li>
    `;
  cafeList.insertAdjacentHTML('afterbegin', item);

  // Edit data //
  // const edit = document.querySelector('#edit');
  // edit.addEventListener('click', (e) => {  <div id="edit">Edit</div>
  //   e.stopPropagation();
  //   const id = e.target.parentNode.getAttribute('data-id');
  //   db.collection('cafes').doc(id).update({});
  // });

  // delet data //
  const cross = document.querySelector('#cross');
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = e.target.parentNode.getAttribute('data-id');
    db.collection('cafes').doc(id).delete();
  });
}

// GETTING DATA //
// db.collection('cafes')
//   .where('city', '==', 'Marioland')
//   .orderBy('name')
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   });

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const { name, city } = form;

  db.collection('cafes').add({
    name: name.value,
    city: city.value,
  });

  form.name.value = '';
  form.city.value = '';
});

// Realtime lisner //
db.collection('cafes')
  .orderBy('city')
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type === 'added') {
        renderCafe(change.doc);
      } else if (change.type === 'removed') {
        let li = document.querySelector(`[data-id=${change.doc.id}]`);
        cafeList.removeChild(li);
      }
    });
  });
