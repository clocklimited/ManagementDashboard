var properties =
  { development:
    { plugins:
      { googleTraffic: { }
      , timetable: { }
      , currentMusic:
        { 'key': 'dc3a3949e46032c61bfc3879d26df4ee'
        , 'secret': '902e90d2190019453d42e17a951545bf'
        , 'useragent': 'Clock/v0.1 ProjectHud'
        , 'username': 'clockmusic'
        }
      , servicesStatus:
        { services:
          { 'github': 'https://status.github.com/api/status.json'
          , 'npm-registry': 'http://registry.npmjs.org'
          , 'npm-www': 'http://npmjs.org'
          , 'pivotaltracker': 'http://www.pivotaltracker.com'
          , 'clocknpm': 'http://npm.clockte.ch'
          }
        }
      , countdown:
        { events:
            [ { name: 'Clock Birthday (18)'
              , date: '2015-11-01 11:00'
              }
            , { name: 'End of Financial Year'
              , date: '2015-03-31 00:00'
              }
            ]
        }
      , googleCalendar:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , scopes: '["https://www.googleapis.com/auth/calendar"]'
        , calendarId: 'clock.co.uk_33323635353432382d393931@resource.calendar.google.com'
        }
      , freshdeskTickets:
        { freshdeskUrl: 'https://clocklimited.freshdesk.com/helpdesk/'
        , apiKey: 'pAUaqhipu7hua5jte9GD'
        , types:
          { open: { name: 'open', filterKey: 313922 }
          , overdue: { name: 'overdue', filterKey: 314299 }
          }
        }
      , companyTargets:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 'tUJh7Dg-ULXOpZ_zX09QpeA'
        , worksheetId: 'od6'
        }
      , employeeAbsences:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 'tAVCptOmtKj6GTy9OcSGuBQ'
        , employeeWorksheet: 'od7'
        , worksheetId: 'od6'
        , holidayApiUrl: 'https://intranet.clock.co.uk/calendar/feed/holidays.php'
        }
      , utilisation:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 't7mL463C8Ppv_bMqufg0dqg'
        , worksheetId: 'od6'
        }
      , qotm:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 'trUwBhLv4pa-dssQysIsFqA'
        , worksheetId: 'od6'
        }
      , internetBandwidth:
        { dataUrl: 'https://graphite.clockhosting.com/render/?width=673&height=256&_salt=1392736300.02'
          + '5&from=-10minutes&title=TOSH%20-%20Bandwidth%20Usage&vtitle=Bandwidth%20%28bps%29&lineMo'
          + 'de=staircase&areaMode=stacked&target=alias%28scale%28derivative%28testing.iain.test2.swi'
          + 'tch.10.39.ifInOctets%29%2C0.125%29%2C%22Fibre%20Download%22%29&target=alias%28scale%28de'
          + 'rivative%28testing.iain.test2.switch.10.39.ifOutOctets%29%2C0.125%29%2C%22Fibre%20Upload'
          + '%22%29&target=alias%28scale%28derivative%28testing.iain.test2.switch.10.40.ifInOctets%29'
          + '%2C0.125%29%2C%22ADSL%20Download%22%29&target=alias%28scale%28derivative%28testing.iain.'
          + 'test2.switch.10.40.ifOutOctets%29%2C0.125%29%2C%22ADSL%20Upload%22%29&format=json'
        }
      , trainTimes:
        { locationFrom: 'KGL'
        , locationTo: 'WFJ'
        }
      , activeProjects: { }
      , twitter:
        { appKey: 'pwvaqsA5NQz5lHIDB6xJQ'
        , appSecret: 'oia6YzlOBKhUapsAXRqRh6PjVxOn0Q2komNWmXn3xY'
        , accessKey: '245303073-eMpOdc0gkVdMMBwfnb7oJS8sHiD4xioVEDtwMPZK'
        , accessSecret: 'nacLOqF9iXLjIiyNTQlx9yGdQZGfju1dd8Xoi7e7Qd8'
        }
      , instagram:
        { accessToken: '1195419024.ca4abda.88b0acc7cb9148509ad19affdc7021a2'
        }
      , daylightMap: { }
      , latestGitCommits:
        { USER: 'matthojo'
        , ACCESS_TOKEN: '91231c0dccbf6b9c3087c36cb370fd92e86e80b1'
        , ORGANISATION: 'clocklimited'
        }
      }
    }
  , production:
    { domain: 'hud.clockte.ch'
    , plugins:
      { googleTraffic: { }
      , timetable: { }
      , currentMusic:
        { 'key': 'dc3a3949e46032c61bfc3879d26df4ee'
        , 'secret': '902e90d2190019453d42e17a951545bf'
        , 'useragent': 'Clock/v0.1 ProjectHud'
        , 'username': 'clockmusic'
        }
      , servicesStatus:
        { services:
          { 'github': 'https://status.github.com/api/status.json'
          , 'npm-registry': 'http://registry.npmjs.org'
          , 'npm-www': 'http://npmjs.org'
          , 'pivotaltracker': 'http://www.pivotaltracker.com'
          , 'clocknpm': 'http://npm.clockte.ch'
          }
        }
      , countdown:
        { events:
            [ { name: 'Clock Birthday (17)'
              , date: '2014-11-01 11:00'
              }
            , { name: 'RIBA Launch'
              , date: '2014-06-27 11:00'
              }
            , { name: 'BOTP Awards'
              , date: '2014-04-25 14:00'
              }
            , { name: 'Times+ Launch'
              , date: '2014-02-18 09:00'
              }
            , { name: 'Department Seating Ends?'
              , date: '2014-02-06 09:00'
              }
            , { name: 'Department Seating'
              , date: '2014-01-06 09:00'
              }
            , { name: 'Clock winter party'
              , date: '2013-12-13 14:00'
              }
            ]
        }
      , googleCalendar:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , scopes: '["https://www.googleapis.com/auth/calendar"]'
        , calendarId: 'clock.co.uk_33323635353432382d393931@resource.calendar.google.com'
        }
      , freshdeskTickets:
        { freshdeskUrl: 'https://clocklimited.freshdesk.com/helpdesk/'
        , apiKey: 'RsrkGqSgV19LJZG71vR7'
        , types:
          { open: { name: 'Tickets' }
          , overdue: { name: 'Overdue' }
          }
        }
      , companyTargets:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 'tUJh7Dg-ULXOpZ_zX09QpeA'
        , worksheetId: 'od6'
        }
      , employeeAbsences:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 'tAVCptOmtKj6GTy9OcSGuBQ'
        , employeeWorksheet: 'od7'
        , worksheetId: 'od6'
        , holidayApiUrl: 'https://intranet.clock.co.uk/calendar/feed/holidays.php'
        }
      , utilisation:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 't7mL463C8Ppv_bMqufg0dqg'
        , worksheetId: 'od6'
        }
      , qotm:
        { emailAddress: '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
        , privateKey: __dirname + '/lib/binary/key.pem'
        , spreadsheetId: 'trUwBhLv4pa-dssQysIsFqA'
        , worksheetId: 'od6'
        }
      , internetBandwidth:
        { dataUrl: 'https://graphite.clockhosting.com/render/?width=673&height=256&_salt=1392736300.02'
          + '5&from=-10minutes&title=TOSH%20-%20Bandwidth%20Usage&vtitle=Bandwidth%20%28bps%29&lineMo'
          + 'de=staircase&areaMode=stacked&target=alias%28scale%28derivative%28testing.iain.test2.swi'
          + 'tch.10.39.ifInOctets%29%2C0.125%29%2C%22Fibre%20Download%22%29&target=alias%28scale%28de'
          + 'rivative%28testing.iain.test2.switch.10.39.ifOutOctets%29%2C0.125%29%2C%22Fibre%20Upload'
          + '%22%29&target=alias%28scale%28derivative%28testing.iain.test2.switch.10.40.ifInOctets%29'
          + '%2C0.125%29%2C%22ADSL%20Download%22%29&target=alias%28scale%28derivative%28testing.iain.'
          + 'test2.switch.10.40.ifOutOctets%29%2C0.125%29%2C%22ADSL%20Upload%22%29&format=json'
        }
      , trainTimes:
        { locationFrom: 'KGL'
        , locationTo: 'WFJ'
        }
      , activeProjects: { }
      , twitter:
        { appKey: 'pwvaqsA5NQz5lHIDB6xJQ'
        , appSecret: 'oia6YzlOBKhUapsAXRqRh6PjVxOn0Q2komNWmXn3xY'
        , accessKey: '245303073-eMpOdc0gkVdMMBwfnb7oJS8sHiD4xioVEDtwMPZK'
        , accessSecret: 'nacLOqF9iXLjIiyNTQlx9yGdQZGfju1dd8Xoi7e7Qd8'
        }
      , instagram:
        { accessToken: '1195419024.ca4abda.88b0acc7cb9148509ad19affdc7021a2'
        }
      , daylightMap: { }
      , latestGitCommits:
        { USER: 'matthojo'
        , ACCESS_TOKEN: '91231c0dccbf6b9c3087c36cb370fd92e86e80b1'
        , ORGANISATION: 'clocklimited'
        }
      }
    }
  }