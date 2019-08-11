var db = openDatabase('vueAgenda', '1.0', 'lista', 5 * 1024 * 1024);
db.transaction(function (sql) {
  sql.executeSql('CREATE TABLE IF NOT EXISTS vueAgenda (id INTEGER PRIMARY KEY, nome TEXT, telefone TEXT)');
});
try {
  db.transaction(function (sql) {
    sql.executeSql('SELECT * FROM vueAgenda', [], function (tx, result) {
      for (var i of result.rows) {
        vm.lista.push(i);
      }
    });
  });
} catch (err) {
  console.log(err);
}
var vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      selected: [],
      name: '',
      telefone: '',
      bottomNav: 'recent',
      lista: [],
      headers: [{
        text: 'Selecionados',
        align: 'left',
        sortable: false,
        value: 'name' },

      { text: 'Nome', value: 'Nome' },
      {
        text: 'Telefone',
        value: 'telefone' }] };


  },
  methods: {
    deletar: function () {

      Swal.fire({
        background: '#111',
        title: 'Deseja Excluir?',
        text: "Esta ação é irreversível",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim' }).
      then(result => {
        if (result.value) {
          try {
            vm.selected.forEach(e => db.transaction(x => x.executeSql(`DELETE FROM vueAgenda WHERE nome == "${e}" `)));
            Swal.fire({
              position: 'center',
              background: '#111',
              type: 'success',
              title: `Dados deletados!`,
              showConfirmButton: false,
              timer: 1500 });

          } catch (err) {
            console.error(err);
          } finally {
            window.location.reload();
          }

        }
      });


    },
    clear: function () {
      this.name = '';
      this.telefone = '';
    },
    submit: function () {

      if (this.name == '' && this.telefone == '') {
        Swal.fire({
          position: 'center',
          background: '#111',
          type: 'error',
          title: `Dados inválidos!`,
          showConfirmButton: false,
          timer: 1500 });


      } else {
        try {
          db.transaction(function (sql) {
            sql.executeSql(`INSERT INTO vueAgenda (nome, telefone) values (?,?)`, [vm.name, vm.telefone]);
            console.log(`nome:  ${vm.name}, telefone: ${vm.telefone} `);
          });
          Swal.fire({
            position: 'center',
            background: '#111',
            type: 'success',
            title: `${vm.name}  Salvo com sucesso!`,
            showConfirmButton: false,
            timer: 1500 });

        } catch (err) {
          console.error(err);
        } finally {
          window.location.reload();
        }

      }
    } } });