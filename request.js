/**
 * This is a template for an on-schedule rule. This rule defines
 * operations that are performed on a set schedule.
 *
 * For details, read the Quick Start Guide:
 * https://www.jetbrains.com/help/youtrack/standalone/2021.1/Quick-Start-Guide-Workflows-JS.html
 */

const entities = require('@jetbrains/youtrack-scripting-api/entities');
const workflow = require('@jetbrains/youtrack-scripting-api/workflow');
const http = require('@jetbrains/youtrack-scripting-api/http');


exports.rule = entities.Issue.onChange({
    // TODO: give the rule a human-readable title
    title: 'Update_a_comment',
    // Условие при котором сробатывает наша логика.
    guard: (ctx) => {
        ctx.issue.comments.isChanged = true;
        return true;
    },
    // Логика
    action: (ctx) => {
        let index = -1;
        console.log(ctx.issue.fields["Номер обращения"]);
        var claim = ctx.issue.fields["Номер обращения"];
        ctx.issue.comments.added.forEach(function(comment) {


            // Проверка - при условии что добавлен последни комментарий и есть номер обращения то выполнить запрос
            if (index < 0 && comment.text && claim !== null) {
                var authorName = ctx.issue.comments.added.first().author.fullName;
                console.log(comment.text);
                const BaseUrl = ""; // указываем полный путь куда идет запрос

                const connection = new http.Connection(`${BaseUrl}`);
                connection
                    .addHeader('Accept', 'application/json, */*')
                    .addHeader('Content-Type', 'application/json');

                const payload = {
                    'authorName': authorName,
                    'text': comment.text
                };

                const response = connection.postSync('', null, payload);

                // Для отладки - выводит ошибку в случае некорректного запроса.
                /**
                 if (response.code === 200 !== -1) {
          const url = response.response;
          ctx.issue.description = ctx.issue.description.replace('{code}' + '{code}',
            'See sample at ' + url);
          workflow.message('Code sample is moved at <a href="' + url + '">' + url + "</a>");
        } else {
          workflow.message('Failed to replace code due to: ' + response.response);
        }
                 */
                console.log(payload);
                console.log(response);
                workflow.message(workflow.i18n('Комментарий добавлен к обращению: ' + claim));
            }

        });
    }

});