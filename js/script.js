//Search Bar Handler
$(function() {
    var searchField = $('#query');
    var icon = $('#search-btn');

    setupEventListeners();
    
    //Focus Handler
    $(searchField).on('focus', function() {

        $(this).animate({
            width: '100%'
        }, 400);
        $(icon).animate({
            right: '10px'
        }, 400);

    });

    //Blur Event Handler
    $(searchField).on('blur', function() {
        if (searchField.val() == '') {
            $(searchField).animate({
                width: '45%'
            }, 400, function() {});

            $(icon).animate({
                right: '360px'
            }, 400, function() {});
        }
    });

    $("#search-form").submit(function(e) {
        e.preventDefault();
    });
});

function search(token) {
    //Get form input
    var params = $('#query').val(),
        config = {
            part: 'snippet, id',
            q: params,
            type: 'video',
            key: 'AIzaSyDBgMqMVuQqofhuFcemc2D9aCBI3RswZSk'
        }

    if (token) {
        config['pageToken'] = token;
    }

    //clear Results
    $('#results').html('');
    $('buttons').html('');

    $.get(
        "https://www.googleapis.com/youtube/v3/search", config,
        function(data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            console.log(data);
            $.each(data.items, function(index, item) {
                var output = getOutput(item);

                //Display Results
                $('#results').append(output);
            });
            var buttons = getButtons(prevPageToken, nextPageToken);
            $('#buttons').empty().append(buttons);
        }
    )
}

function setupEventListeners() {
    $('#results').on('click', function(e) {
        var videoId = $(e.target).closest('li').data('videoid');
        var url = 'http://youtube.com/embed/'+ videoId;
        $('.youtube-overlay').toggle().find('iframe').attr("src",url)
        console.log(videoId);
    });

    //We need this when this to close the modal
    $('.youtube-overlay').on('click', function(e) {
        //TO-DO how to check the state of toggle
        $('.youtube-overlay').toggle();
    })
}

function nextPage() {
    var token = $("#next-btn").data("token");
    search(token);
}

function prevPage() {
    var token = $("#prev-btn").data("token");
    search(token);
}

function getButtons(prevPageToken, nextPageToken) {
    var params = $("#search").val();
    var btnOutput = '';
    if (!prevPageToken) {
        btnOutput = '<div class="button-container">' +
            '<button id="next-btn" class="paging-btn" data-token="' +
            nextPageToken +
            '" onclick="nextPage()">Next </button>' +
            '</div>';
    } else {
        btnOutput = '<div class="button-container">' +
            '<button id="prev-btn" class="paging-btn" data-token="' +
            prevPageToken + '" onclick="prevPage()">Previous</button>' +
            '<button id="next-btn" class="paging-btn" data-token="' +
            nextPageToken + '"onclick="nextPage()">Next</button>' +
            '</div>'
    }
    return btnOutput;
}

function getOutput(item) {
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var title = item.snippet.title;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;

    var output = '<li class="list-item" data-videoid="'+ videoId +'">' +
        '<div class="list-left">' +
        '<img  class="list-left-img" src="' + thumb + '">' +
        '</div>' +
        '<div class="list-right">' +
        '<h3>' + title + '</h3>' +
        '<small>By <span class="cTitle">' + channelTitle + '</span> on ' + videoDate + '</small>' +
        '<p>' + description + '</p>' +
        '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return output;

}