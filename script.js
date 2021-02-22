$(document).ready(function() {

    const apiRoot = 'http://peaceful-beyond-59271.herokuapp/v1/task/';
    const trelloApiRoot = 'http://peaceful-beyond-59271.herokuapp/v1/trello/';
    const datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
    const $tasksContainer = $('[data-tasks-container]');

    var availableBoards = {};
    var availableTasks = {};



    function getAllAvailableBoards(callback, callbackArgs) {
        var requestUrl = trelloApiRoot + 'getTrelloBoards';

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: 'application/json',
            success: function(boards) { callback(callbackArgs, boards); }
        });
    }

  function createElement(data) {
    const element = $(datatableRowTemplate).clone();

    element.attr('data-task-id', data.id);
    element.find('[data-task-name-section] [data-task-name-paragraph]').text(data.title);
    element.find('[data-task-name-section] [data-task-name-input]').val(data.title);

    element.find('[data-task-content-section] [data-task-content-paragraph]').text(data.content);
    element.find('[data-task-content-section] [data-task-content-input]').val(data.content);

    return element;
  }

    function prepareBoardOrListSelectOptions(availableChoices) {
        return availableChoices.map(function(choice) {
            return $('<option>')
                .addClass('crud-select__option')
                .val(choice.id)
                .text(choice.name || 'Unknown name');
        });
    }



   function handleTaskSubmitRequest(event) {
    event.preventDefault();

    var taskTitle = $(this).find('[name="title"]').val();
    var taskContent = $(this).find('[name="content"]').val();

    var requestUrl = apiRoot + '/v1/trello/createTask';

    alert("dupa");
    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        title: taskTitle,
        content: taskContent
      }),
      complete: function(data) {
        if(data.status === 200) {
          getAllTasks();
        }
     }
    });
  }

  function toggleEditingState() {
      var parentEl = $(this).parents('[data-task-id]');
    
    parentEl.toggleClass('datatable__row--editing');

    var taskTitle = parentEl.find('[data-task-name-paragraph]').text();
    var taskContent = parentEl.find('[data-task-content-paragraph]').text();

    parentEl.find('[data-task-name-input]').val(taskTitle);
    parentEl.find('[data-task-content-input]').val(taskContent);
  }

function handleBoardNameSelect(event) {
    var $changedSelectEl = $(event.target);
    var selectedBoardId = $changedSelectEl.val();
    var $listNameSelectEl = $changedSelectEl.siblings('[data-list-name-select]');
    var preparedListOptions = prepareBoardOrListSelectOptions(availableBoards[selectedBoardId].lists);

    $listNameSelectEl.empty().append(preparedListOptions);
}






 
  $('[data-task-add-form]').on('submit', handleTaskSubmitRequest);


});