<template>


  <!-- Début d'espace des cadres -->


  <div class="row">
    <h1 class="h2 mb-3">Tableau de board Administrateur</h1>
    <div class="col-4">
      <div class="card text-bg-primary mb-3">
        <div class="card-header"><i class="fa fa-user" aria-hidden="true"></i> Personnels</div>
        <div class="card-body">
          <h5 class="card-title">Nombre de personnels : <b>{{ this.personnels.length }}</b> </h5>
          <p class="card-text">Vous pouvez gérer les personnels en cliquant <router-link to="/personnel/list"
              style="color: white;"><b>ici</b></router-link>.</p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card text-bg-secondary mb-3">
        <div class="card-header"><i class="fa fa-gavel" aria-hidden="true"></i> Matériels</div>
        <div class="card-body">
          <h5 class="card-title">Nombre de matériels : <b>{{ this.materiels.length }}</b></h5>
          <p class="card-text">Vous pouvez gérer les matériels en cliquant <router-link to="/materiel/list"
              style="color: black;"><b>ici</b></router-link>.</p>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="card text-bg-success mb-3">
        <div class="card-header"><i class="fa fa-file-text-o" aria-hidden="true"></i> Demandes</div>
        <div class="card-body">
          <h5 class="card-title">Nombre de demandes : <b>{{ this.demandes.length }}</b></h5>
          <p class="card-text">Vous pouvez gérer les demandes en cliquant <router-link to="/demandes/gerer"
              style="color: white;"><b>ici</b></router-link>.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Fin d'espace des cadres -->


  <!-- Début Statistiques -->
  <h2>Statistiques sur la fourniture</h2>
  <div class="row" v-if="loaded">
    <div class="d-flex justify-content-center ">
      <div class="col-md-8">
        <Bar id="my-chart-id" :options="chartOptions" :data="this.chartData" height="200px" />
      </div>
    </div>
  </div>

  <!-- Fin Statistiques -->

  <div class="row">
    <div class="col-12">

      <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

        <h2>Liste des matériels affectés</h2>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2">
            <button type="button" @click="downloadCSV" class="btn btn-sm btn-outline-secondary me-1"><i
                class="fa fa-file-text " aria-hidden="true"></i> Exporter CSV</button>
            <button type="button" @click="exportToPDF" class="btn btn-sm btn-outline-secondary"><i
                class="fa fa-file-pdf-o" aria-hidden="true"></i> Exporter PDF</button>
          </div>
        </div>
      </div>

    </div>
  </div>


  <!-- Debut data table  -->
  <table id="example" class="display" style="width:100%">
    <thead>
      <tr>
        <th>
          Id
        </th>
        <th>
          Numéro d'inventaire
        </th>
        <th>
          Type
        </th>
        <th>
          Affecté à
        </th>
        <th>
          Date dffectation
        </th>
      </tr>
    </thead>
  </table>
  <!-- Fin data table -->



</template>

<script>
import { Bar } from 'vue-chartjs'; // Pour le graphe du statistiques
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
import axios from 'axios';
import jsPDF from 'jspdf'; //Bibliothèque pour importer la liste des matériels affectés affectés en format PDF
import 'jspdf-autotable';  //Bibliothèque pour importer la liste des matériels affectés affectés en format PDF
import Papa from 'papaparse'; //Bibliothèque pour importer la liste des matériels affectés affectés en format CSV

export default {
  name: 'ProductForm',
  components: { Bar },
  data() {
    return {
      form: {
        numInventaire: '',
        type: '',
        dateAcquisition: '',
        affecterPers: null,
        dateAffectation: ''
      },
      materiels: [],
      materielsAffectes: [],
      demandes: [],
      personnels: [],
      ajoute: false,
      chartOptions: {
        responsive: true
      },
      fournitures: [],
      loaded: false
    }
  },
  methods: {
    formattedDate(date) { // pour formatter la date
      date = new Date(date);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
      return new Intl.DateTimeFormat('en-GB', options).format(date)
    },
    exportToPDF() { //Fonction pour importer la liste des matériels affectés en format PDF
      const doc = new jsPDF();
      doc.text('                                       Liste du materiels affectés', 10, 10);
      doc.autoTable({
        head: [["Id", "Numéro d'inventaire", "Type", "Affecté à", "Date d'affectation"]],
        body: this.listToExport,
      });
      doc.save('materiels_affectes.pdf');
    },
    downloadCSV() {

      const csv = Papa.unparse(this.listToExport, { delimiter: ',' });//Fonction pour importer la liste des matériels affectés en format PDF
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'materiels_affectes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

  },
  computed: {
    chartData() {
      return {
        labels: this.fournitures.map(object => object.type),
        datasets: [{ data: this.fournitures.map(object => object.nombre), label: 'Quantité de la fourniture', backgroundColor: '#008B74' }],
      };
    },
    listToExport() {
      return this.materielsAffectes.map(row => [row.id, row.numInventaire, row.type, row.affecterPers, this.formattedDate(row.dateAffectation)])
    }

  },
  created() {
    axios.get('/api/fourniture').then(response => {
      if (response.status == 200) {
        this.fournitures = response.data;
        this.loaded = true;
      }
    });

    axios.get('/api/materiel').then(response => {
      if (response.status == 200) {
        this.materiels = response.data;
        this.materielsAffectes = this.materiels.filter(item => item.affecterPers != null);
        $('#example').DataTable({
          dom: 'Bfrtip',
          data: this.materielsAffectes.map(row => [row.id, row.numInventaire, row.type, row.affecterPers, this.formattedDate(row.dateAffectation)]),
          language:
          {
            "emptyTable": "Aucun matériles n'est diponible",
            "loadingRecords": "Chargement...",
            "processing": "Traitement...",
            "select": {
              "rows": {
                "_": "%d lignes sélectionnées",
                "1": "1 ligne sélectionnée"
              },
              "cells": {
                "1": "1 cellule sélectionnée",
                "_": "%d cellules sélectionnées"
              },
              "columns": {
                "1": "1 colonne sélectionnée",
                "_": "%d colonnes sélectionnées"
              }
            },
            "autoFill": {
              "cancel": "Annuler",
              "fill": "Remplir toutes les cellules avec <i>%d<\/i>",
              "fillHorizontal": "Remplir les cellules horizontalement",
              "fillVertical": "Remplir les cellules verticalement"
            },
            "searchBuilder": {
              "conditions": {
                "date": {
                  "after": "Après le",
                  "before": "Avant le",
                  "between": "Entre",
                  "empty": "Vide",
                  "not": "Différent de",
                  "notBetween": "Pas entre",
                  "notEmpty": "Non vide",
                  "equals": "Égal à"
                },
                "number": {
                  "between": "Entre",
                  "empty": "Vide",
                  "gt": "Supérieur à",
                  "gte": "Supérieur ou égal à",
                  "lt": "Inférieur à",
                  "lte": "Inférieur ou égal à",
                  "not": "Différent de",
                  "notBetween": "Pas entre",
                  "notEmpty": "Non vide",
                  "equals": "Égal à"
                },
                "string": {
                  "contains": "Contient",
                  "empty": "Vide",
                  "endsWith": "Se termine par",
                  "not": "Différent de",
                  "notEmpty": "Non vide",
                  "startsWith": "Commence par",
                  "equals": "Égal à",
                  "notContains": "Ne contient pas",
                  "notEndsWith": "Ne termine pas par",
                  "notStartsWith": "Ne commence pas par"
                },
                "array": {
                  "empty": "Vide",
                  "contains": "Contient",
                  "not": "Différent de",
                  "notEmpty": "Non vide",
                  "without": "Sans",
                  "equals": "Égal à"
                }
              },
              "add": "Ajouter une condition",
              "button": {
                "0": "Recherche avancée",
                "_": "Recherche avancée (%d)"
              },
              "clearAll": "Effacer tout",
              "condition": "Condition",
              "data": "Donnée",
              "deleteTitle": "Supprimer la règle de filtrage",
              "logicAnd": "Et",
              "logicOr": "Ou",
              "title": {
                "0": "Recherche avancée",
                "_": "Recherche avancée (%d)"
              },
              "value": "Valeur",
              "leftTitle": "Désindenter le critère",
              "rightTitle": "Indenter le critère"
            },
            "searchPanes": {
              "clearMessage": "Effacer tout",
              "count": "{total}",
              "title": "Filtres actifs - %d",
              "collapse": {
                "0": "Volet de recherche",
                "_": "Volet de recherche (%d)"
              },
              "countFiltered": "{shown} ({total})",
              "emptyPanes": "Pas de volet de recherche",
              "loadMessage": "Chargement du volet de recherche...",
              "collapseMessage": "Réduire tout",
              "showMessage": "Montrer tout"
            },
            "buttons": {
              "collection": "Collection",
              "colvis": "Visibilité colonnes",
              "colvisRestore": "Rétablir visibilité",
              "copy": "Copier",
              "copySuccess": {
                "1": "1 ligne copiée dans le presse-papier",
                "_": "%d lignes copiées dans le presse-papier"
              },
              "copyTitle": "Copier dans le presse-papier",
              "csv": "CSV",
              "excel": "Excel",
              "pageLength": {
                "-1": "Afficher toutes les lignes",
                "_": "Afficher %d lignes",
                "1": "Afficher 1 ligne"
              },
              "pdf": "PDF",
              "print": "Imprimer",
              "copyKeys": "Appuyez sur ctrl ou u2318 + C pour copier les données du tableau dans votre presse-papier.",
              "createState": "Créer un état",
              "removeAllStates": "Supprimer tous les états",
              "removeState": "Supprimer",
              "renameState": "Renommer",
              "savedStates": "États sauvegardés",
              "stateRestore": "État %d",
              "updateState": "Mettre à jour"
            },
            "decimal": ",",
            "datetime": {
              "previous": "Précédent",
              "next": "Suivant",
              "hours": "Heures",
              "minutes": "Minutes",
              "seconds": "Secondes",
              "unknown": "-",
              "amPm": [
                "am",
                "pm"
              ],
              "months": {
                "0": "Janvier",
                "2": "Mars",
                "3": "Avril",
                "4": "Mai",
                "5": "Juin",
                "6": "Juillet",
                "8": "Septembre",
                "9": "Octobre",
                "10": "Novembre",
                "1": "Février",
                "11": "Décembre",
                "7": "Août"
              },
              "weekdays": [
                "Dim",
                "Lun",
                "Mar",
                "Mer",
                "Jeu",
                "Ven",
                "Sam"
              ]
            },
            "editor": {
              "close": "Fermer",
              "create": {
                "title": "Créer une nouvelle entrée",
                "button": "Nouveau",
                "submit": "Créer"
              },
              "edit": {
                "button": "Editer",
                "title": "Editer Entrée",
                "submit": "Mettre à jour"
              },
              "remove": {
                "button": "Supprimer",
                "title": "Supprimer",
                "submit": "Supprimer",
                "confirm": {
                  "_": "Êtes-vous sûr de vouloir supprimer %d lignes ?",
                  "1": "Êtes-vous sûr de vouloir supprimer 1 ligne ?"
                }
              },
              "multi": {
                "title": "Valeurs multiples",
                "info": "Les éléments sélectionnés contiennent différentes valeurs pour cette entrée. Pour modifier et définir tous les éléments de cette entrée à la même valeur, cliquez ou tapez ici, sinon ils conserveront leurs valeurs individuelles.",
                "restore": "Annuler les modifications",
                "noMulti": "Ce champ peut être modifié individuellement, mais ne fait pas partie d'un groupe. "
              },
              "error": {
                "system": "Une erreur système s'est produite (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">Plus d'information<\/a>)."
              }
            },
            "stateRestore": {
              "removeSubmit": "Supprimer",
              "creationModal": {
                "button": "Créer",
                "order": "Tri",
                "paging": "Pagination",
                "scroller": "Position du défilement",
                "search": "Recherche",
                "select": "Sélection",
                "columns": {
                  "search": "Recherche par colonne",
                  "visible": "Visibilité des colonnes"
                },
                "name": "Nom :",
                "searchBuilder": "Recherche avancée",
                "title": "Créer un nouvel état",
                "toggleLabel": "Inclus :"
              },
              "renameButton": "Renommer",
              "duplicateError": "Il existe déjà un état avec ce nom.",
              "emptyError": "Le nom ne peut pas être vide.",
              "emptyStates": "Aucun état sauvegardé",
              "removeConfirm": "Voulez vous vraiment supprimer %s ?",
              "removeError": "Échec de la suppression de l'état.",
              "removeJoiner": "et",
              "removeTitle": "Supprimer l'état",
              "renameLabel": "Nouveau nom pour %s :",
              "renameTitle": "Renommer l'état"
            },
            "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
            "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
            "infoFiltered": "(filtrées depuis un total de _MAX_ entrées)",
            "lengthMenu": "Afficher _MENU_ entrées",
            "paginate": {
              "first": "Première",
              "last": "Dernière",
              "next": "Suivante",
              "previous": "Précédente"
            },
            "zeroRecords": "Aucune entrée correspondante trouvée",
            "aria": {
              "sortAscending": " : activer pour trier la colonne par ordre croissant",
              "sortDescending": " : activer pour trier la colonne par ordre décroissant"
            },
            "infoThousands": " ",
            "search": "Rechercher :",
            "thousands": " "
          }
        });
        // test(this.materielsAffectes);
      }
    }),
      axios.get('/api/personnel').then(response => {
        if (response.status == 200) {
          this.personnels = response.data
        }
      }),
      axios.get('/api/demande').then(response => {
        if (response.status == 200) {
          this.demandes = response.data
        }
      })
  }

}


</script>
