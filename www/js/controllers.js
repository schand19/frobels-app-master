  angular.module('Forbels.controllers', [])

      .controller('AppCtrl', function($scope, $ionicPlatform, $cordovaToast, $ionicModal, $ionicPopup, $timeout, $state, $ionicHistory, LoginService, ContactusService) {

          $scope.loginUser = window.localStorage.getItem('login_type');

          $scope.logout = function() {

              window.localStorage.clear();
              $ionicHistory.clearCache();

              $state.go('login');
          };

          $scope.contactus = function() {
              $state.go('app.contactus')
          };

          $scope.timetableview = function() {
              $state.go('app.timetable');
          };

          $scope.searchparentview = function() {
              $state.go('app.searchparent');
          };

          $scope.applyleave = function() {
              $state.go('app.teacherapplyleave');
          };

          $scope.adminLeaveView = function() {
              $state.go('app.adminleavemanagement');
          }

          $scope.feeView = function() {
              $state.go('app.adminfees');
          }

          $scope.feeDetails = function() {
              $state.go('app.feedetails');
          }

          $scope.showProfile = function() {
              if (window.localStorage.getItem('login_type') == 'teacher') {
                  $state.go('app.viewprofile', { type: window.localStorage.getItem('login_type'), personId: JSON.parse(window.localStorage.getItem('loginDetails')).object_id });
              } else {
                  $state.go('app.viewprofile', { type: window.localStorage.getItem('login_type'), personId: window.localStorage.getItem('currentStudentId') });
              }
          };

          // Perform the login action when the user submits the login form

      })

      .controller('LoginController', ["$scope", "$state", "$stateParams", "$ionicModal", "$cordovaToast", "$rootScope", "$filter", "LoginService", function($scope, $state, $stateParams, $ionicModal, $cordovaToast, $rootScope, $filter, LoginService) {
          $scope.loginData = {};

          $scope.forgotPasswordObj = {};

          $scope.changeObj = {};

          $scope.selectedSchool = $stateParams.selectedSchool;

          $scope.takeMeToFindSchool = function() {
              $state.go('findSchool');
          }
          $scope.doLogin = function() {
              console.log("Entered")

              $scope.loginData.token = $rootScope.token;


              LoginService.login($scope.loginData).then(
                  function(result) {
                      if (result.data.error) {
                          // alert(result.data.error + 'line 55');
                          $cordovaToast.showShortTop(result.data.error).then(
                              function(success) {


                              },
                              function(error) {

                              }
                          )
                          $scope.loginData = {};
                      } else {
                          if (result.data.newMessages > 0) {
                              $rootScope.messageCount = result.data.newMessages;
                          }

                          window.localStorage.setItem('oauth', result.data.userdetails.oauth);
                          $rootScope.loginDetails = result.data.userdetails;
                          $rootScope.login_type = result.data.userdetails.login_type;
                          window.localStorage.setItem('loginDetails', JSON.stringify(result.data.userdetails));
                          window.localStorage.setItem('login_type', result.data.userdetails.login_type);
                          window.localStorage.setItem('schoolId', result.data.schoolId);
                          if (result.data.userdetails.login_type == 'parent') {
                              $state.go('app.dashboard', { childDetails: result.data.userdetails.children_details });
                          } else if (result.data.userdetails.login_type == 'teacher') {
                              $state.go('app.dashboard');
                          } else {
                              $state.go('app.dashboard', { teachers: result.data.teachers });
                          }
                      }
                  },
                  function(error) {
                      $cordovaToast.showShortTop('Something went wrong please try again or try after few minutes').then(
                          function(success) {

                          },
                          function(error) {

                          }
                      )

                  }
              )
          };

          $scope.resestPasswordModal = function() {

          };

          $ionicModal.fromTemplateUrl('templates/popups/forgot.html', {
              scope: $scope,
          }).then(function(modal) {
              $scope.forgotModal = modal;
          })

          $scope.forgotPassword = function() {
              $scope.forgotModal.show();
          };

          // window.localStorage.getItem('login_type') == 'parent' // state.go('app.teacherinbox');
          $scope.submitForgotPassword = function(forgotObj) {
              console.log(typeof forgotObj.dob);
              console.log(forgotObj.dob);
              if (forgotObj.admission_no && forgotObj.dob && forgotObj.mobile_no) {
                  // forgotObj.dob = $filter('date')(new Date(forgotObj.dob), 'yyyy-MM-dd')
                  LoginService.forgotPassword(forgotObj).then(
                      function(response) {
                          console.log(response);
                          $scope.forgotModal.hide();
                          $scope.forgotPasswordObj = {};
                          $cordovaToast.showLongTop(response.data.response).then(
                              function(success) {

                              },
                              function(error) {

                              }
                          )
                      },
                      function(error) {
                          console.log(response);
                      }
                  )
              } else {
                  alert('Please fill all the details');
              }
          };

          $ionicModal.fromTemplateUrl('templates/popups/reset.html', {
              scope: $scope,
          }).then(function(modal) {
              $scope.changeModal = modal;
          })

          $scope.changePassword = function() {
              $scope.changeModal.show();
          };

          $scope.changeCredentials = function(changeObj) {
              if (changeObj.username && changeObj.old_pwd && changeObj.new_pwd) {
                  // forgotObj.dob = $filter('date')(new Date(forgotObj.dob), 'yyyy-MM-dd')
                  LoginService.changepassword(changeObj).then(
                      function(response) {
                          console.log(response);
                          $scope.changeModal.hide();
                          $scope.changeObj = {};
                          $cordovaToast.showShortTop(response.data.response).then(
                              function(success) {

                              },
                              function(error) {

                              }
                          )
                      },
                      function(error) {
                          console.log(response);
                      }
                  )
              } else {
                  $cordovaToast.showShortTop('Please fill all the details').then(
                      function(success) {

                      },
                      function(error) {

                      }
                  )
              }
          };

      }])

      /* Landing page for both parent and teacher */

      .controller('DashboradController', ["$scope", "$state", "$ionicPopup", "$rootScope", "dashBoradService", "dashBoardSlidesService", "$ionicSlideBoxDelegate", function($scope, $state, $ionicPopup, $rootScope, dashBoradService, dashBoardSlidesService, $ionicSlideBoxDelegate) {
          console.log($state.params.childDetails);
          // $scope.childDetails = $state.params.childDetails;
          $scope.teachersList = [];
          if ($state.params.teachers) {
              window.localStorage.setItem('teachers', JSON.stringify($state.params.teachers));
          }

          // console.log(JSON.parse(window.localStorage.getItem('teachers')));
          $scope.teachersList = JSON.parse(window.localStorage.getItem('teachers'));

          if ($rootScope.messageCount) {
              $scope.messageCount = $rootScope.messageCount;
          }

          if ($state.params.childDetails) {
              window.localStorage.setItem('childDetails', JSON.stringify($state.params.childDetails));
              $scope.childDetails = JSON.parse(window.localStorage.getItem('childDetails'));
              $scope.currentStudentId = $scope.childDetails[0].student_id;
              window.localStorage.setItem('currentStudentId', $scope.childDetails[0].student_id);
          }

          if (window.localStorage.getItem('childDetails')) {
              $scope.childDetails = JSON.parse(window.localStorage.getItem('childDetails'));
              $scope.currentStudentId = $scope.childDetails[0].student_id;
          }

          $scope.loginDetails = $rootScope.loginDetails || JSON.parse(window.localStorage.getItem('loginDetails'));

          /* This function is for switching child if there are multiple */
          $scope.studentSelect = function() {
              var childSelect = $ionicPopup.show({
                  title: "Select a child",
                  templateUrl: 'templates/popups/student_select.html',
                  scope: $scope,
                  buttons: [
                      { text: "Cancel" }
                  ]
              });
              $scope.selectedChild = function(studentId) {
                  console.log("called");
                  $scope.currentStudentId = studentId;
                  window.localStorage.setItem('currentStudentId', $scope.childDetails[0].student_id);
                  childSelect.close();
              }
          };

          $scope.textParent = function() {
              $state.go('app.teacherinbox', { teacherId: $scope.loginDetails.object_id });
          };

          $scope.openFacebookPage = function() {
              console.log("print something");
              cordova.InAppBrowser.open('https://www.google.com', '_blank');
          };


          $scope.getImages = function() {
              $scope.ImagesAPI = "http://www.frobelsedu.com";
              $ionicSlideBoxDelegate.slide(3, [3000]);
              dashBoardSlidesService.getImageSlides()
                  .then(
                      function(response) {
                          console.log(response.data);
                          $scope.imageSlides = response.data.images;
                      },
                      function(error) {
                          console.log(error);
                      }
                  )
          };
          $scope.getImages();

      }])

      /* This for parent to view child attendance */
      .controller('AttendanceController', ['$scope', '$stateParams', '$rootScope', 'AttendanceService', function($scope, $stateParams, $rootScope, AttendanceService) {

          var studentId = $stateParams.studentId;

          $scope.getAttendanceForStudent = function(studentId) {
              $rootScope.$broadcast('loading:show');
              AttendanceService.getStudentAttendance(studentId).then(
                  function(response) {
                      $scope.attendanceDetails = response.data.attendance;
                      console.log($scope.attendanceDetails);
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getAttendanceForStudent(studentId);

      }])

      /* This for parent to view child marks */
      .controller('MarksController', ["$scope", "$state", "$stateParams", "$rootScope", "$timeout", "MarksService", function($scope, $state, $stateParams, $rootScope, $timeout, MarksService) {
          var studentId = $stateParams.studentId;

          $scope.getMarksForStudent = function(studentId) {
              $rootScope.$broadcast('loading:show');
              MarksService.getStudentMarksNAttendance(studentId).then(
                  function(response) {
                      $scope.exams = response.data.marks;
                      console.log($scope.marks);
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getMarksForStudent(studentId);

          $scope.goToDetail = function(exam_id) {
              angular.forEach($scope.exams, function(value, key) {
                  if (value.exam_id == exam_id) {
                      $timeout(function() {
                          $state.go('app.exam-details', { data: value })
                      })
                  }
              })
          };

      }])

      .controller('ExamController', ["$scope", "$state", function($scope, $state) {
          $scope.marks = $state.params.data.submarks;
          $scope.exam_name = $state.params.data.exam_name;
          $scope.total = $state.params.data.totalDetails;
      }])

      .controller('ImageGalleryController', ["$scope", "$state", "$rootScope", "ImageGalleryService", function($scope, $state, $rootScope, ImageGalleryService) {
          console.log("Entered");
          $scope.FrobelsApi = "http://www.frobelsedu.com/admin/upload_images/galary_images/";
          $scope.imageGallery = function() {
              $rootScope.$broadcast('loading:show');
              ImageGalleryService.getImageGallery().then(
                  function(response) {
                      console.log(response);
                      $scope.albums = response.data;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.openAlbum = function(index) {
              $state.go('app.album', { album: $scope.albums[index] });
          };

          $scope.imageGallery();
      }])

      .controller('NotificationController', ["$scope", "$rootScope", "$stateParams", "NotificationService", function($scope, $rootScope, $stateParams, NotificationService) {
          $scope.getNotifications = function() {
              var requestParams = {
                  type: $stateParams.level
              }
              $rootScope.$broadcast('loading:show');
              NotificationService.notifications(requestParams).then(
                  function(response) {
                      $scope.notifications = response.data.notifications;
                      console.log($scope.notifications);
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          }
          $scope.getNotifications();
      }])

      .controller('ChatsController', ["$scope", "$state", "$stateParams", "$rootScope", "ChatService", function($scope, $state, $stateParams, $rootScope, ChatService) {
          var studentId = $stateParams.studentId;
          console.log(studentId);
          $scope.loginDetails = $rootScope.loginDetails || JSON.parse(window.localStorage.getItem('loginDetails'));
          $scope.getTechersList = function(studentId, parentId) {
              $rootScope.$broadcast('loading:show');
              ChatService.getTeachersList(studentId, parentId).then(
                  function(response) {
                      $scope.teachersData = response.data.chat_members;
                      angular.forEach($scope.teachersData, function(subjectwiseInfo, key) {
                          var emp_ids = subjectwiseInfo.emp_id.split(',');
                          var emp_names = subjectwiseInfo.emp_name.split(',');
                          var emp_phones = subjectwiseInfo.emp_phone.split(',');
                          var employees = [];
                          for (var emp in emp_names) {
                              var employee = {
                                  emp_name: emp_names[emp],
                                  emp_id: emp_ids[emp],
                                  emp_phone: emp_phones[emp]
                              };
                              employees.push(employee);
                          }
                          $scope.teachersData[key].employees = employees;
                      })
                      console.log($scope.teachersData);
                      console.log(response);
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          var getChatRequestParams = {
              object_id: $scope.loginDetails.object_id,
              type: $scope.loginDetails.login_type
          };

          /* For getting chat history between parent and teacher.
           Same is present in TeacherController Controller
          */
          $scope.getChat = function(getChatRequestParams) {
              $rootScope.$broadcast('loading:show');
              ChatService.getChat(getChatRequestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.chatHistoryList = response.data.chats;
                      $scope.getTechersList(studentId, $scope.loginDetails.object_id);
                  },
                  function(error) {
                      console.log(error);
                  }
              )
          };

          $scope.getChat(getChatRequestParams);

          /*
           For showing dot in chat list if there are new messages added to the chat history whic are unread.
           Same is present in TeacherController Controller
          */
          $scope.showUnread = function(index) {

              if ($scope.chatHistoryList == undefined) {
                  return '';
              }
              var chatListForTeacher = $scope.chatHistoryList.filter(function(value) {
                  return (value.message_to == index) || (value.message_from == index);
              });

              var showDot = false;

              if (chatListForTeacher.length > 0) {
                  chatListForTeacher.forEach(function(value) {
                      if (value.message_read == '0') {
                          showDot = true;
                      }
                  });
              }
              return showDot;
          };

          $scope.textTeacher = function(emp, subject) {
              console.log(emp.emp_id + " " + subject);
              var memberData = {
                  emp_id: emp.emp_id,
                  emp_name: emp.emp_name,
                  subject_name: subject,
                  emp_phone: emp.emp_phone
              };
              $state.go('app.message', { memberData: memberData });
          };
      }])

      /* For sending message. Both for parent and teacher same controller is utilized */
      .controller('MessageController', ["$scope", "$state", "$stateParams", "$rootScope", "MessageService", "ChatService", "$ionicScrollDelegate", "$timeout", "$interval", function($scope, $state, $stateParams, $rootScope, MessageService, ChatService, $ionicScrollDelegate, $timeout, $interval) {
          $scope.userData = $state.params.memberData;
          if ($state.params.teacherId) {
              $scope.teacherId = $state.params.teacherId;
          }

          $scope.footer = {
              view: true
          };

          console.log($scope.teacherId);
          console.log($scope.userData);
          console.log($rootScope.loginDetails);
          $scope.loginDetails = angular.copy($rootScope.loginDetails || JSON.parse(window.localStorage.getItem('loginDetails')));
          $scope.data = {};
          if ($scope.loginDetails) {
              if ($scope.loginDetails.login_type !== 'admin' && $scope.loginDetails.object_id) {
                  $scope.myId = $scope.loginDetails.object_id;
                  $scope.myType = $scope.loginDetails.login_type;
              } else if ($scope.loginDetails.login_type == 'admin') {
                  $scope.myId = $scope.loginDetails.iAdminId;
                  $scope.myType = $scope.loginDetails.login_type;
                  $scope.loginDetails.object_id = $scope.myId;
              } else {
                  $scope.myId = $scope.teacherId;
                  $scope.myType = 'teacher';
                  $scope.loginDetails.object_id = $scope.myId;
                  $scope.loginDetails.login_type = $scope.myType;
                  $scope.footer.view = true;
              }
          }

          $scope.openwhatsapp = function(phoneNumber) {
              window.open('https://api.whatsapp.com/send?phone=91' + phoneNumber, '_system', 'location=yes');
          }

          $scope.phoneNumber = $scope.userData.father_mobile_num || $scope.userData.emp_phone

          $scope.sendMessage = function() {
              var requestParams = {
                  from_id: $scope.loginDetails.object_id,
                  from_type: $scope.loginDetails.login_type,
                  to_id: $scope.userData.emp_id || $scope.userData.parent_id,
                  description: $scope.data.message,
                  subject: "Chat" || $scope.subjectForTeacher,
                  type: $scope.userData.type
              };

              $scope.messages.push({
                  text: $scope.data.message,
                  id: $scope.loginDetails.object_id,
                  type: $scope.loginDetails.login_type,
                  newM: true
              });

              delete $scope.data.message;

              MessageService.sendMessage(requestParams).then(
                  function(response) {
                      console.log(response);
                  },
                  function(error) {
                      console.log("Error send message");
                  }
              )
              $ionicScrollDelegate.scrollBottom(true);
          };
          console.log("object_id", $scope.userData);

          var getChatRequestParams = {
              object_id: $scope.userData.object_id || $scope.loginDetails.object_id,
              type: $scope.loginDetails.login_type,
              to_id: $scope.userData.emp_id || $scope.userData.parent_id,
              msg_to: $scope.userData.type
          };

          $scope.getChat = function(getChatRequestParams) {
              $rootScope.$broadcast('loading:show');
              ChatService.getChat(getChatRequestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.chatHistoryList = response.data.chats;
                      $scope.addMessagesOfChatHistory();
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
              $ionicScrollDelegate.scrollBottom(true);
          };


          $interval(function() {
              ChatService.getChat(getChatRequestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.chatHistoryList = response.data.chats;
                      $scope.addMessagesOfChatHistory();
                  },
                  function(error) {
                      console.log(error);
                  }
              )
              //$ionicScrollDelegate.scrollBottom(true);
          }, 5000);

          /* For updating message read. Once chat is studied then inorder update history this function is used.*/
          $scope.updateMessageRead = function(updateMessageString) {
              updateMessageString = updateMessageString.substring(0, updateMessageString.length - 1);

              var requestParams = {
                  message_id: updateMessageString
              };

              ChatService.updatMessageRead(requestParams).then(
                  function(response) {
                      console.log(response);
                  },
                  function(error) {
                      console.log(error);
                  }
              );
              $ionicScrollDelegate.scrollBottom(true);
          };

          /* Adding messages to chat history */
          $scope.addMessagesOfChatHistory = function() {
              var updateMessageString = "";
              $scope.messages = [];
              /*
              if($scope.loginDetails.object_id == ($scope.userData.emp_id || $scope.userData.parent_id)) {
                $scope.myId = $scope.loginDetails.object_id + 'A';
              }
              */

              var historyMessages = $scope.chatHistoryList.filter(function(value) {
                  if ($scope.loginDetails.object_id == ($scope.userData.emp_id || $scope.userData.parent_id)) {
                      // $scope.myId = $scope.loginDetails.object_id + 'A';
                      return (value.message_to == $scope.loginDetails.object_id) && (value.message_from == $scope.loginDetails.object_id)
                  } else {
                      return (value.message_to == $scope.userData.emp_id || $scope.userData.parent_id) || (value.message_from == $scope.userData.emp_id || $scope.userData.parent_id);
                  }
              });
              console.log(historyMessages);
              if (historyMessages.length > 0) {
                  historyMessages.forEach(function(value, index) {
                      $scope.messages.push({
                          text: value.message_description,
                          id: value.message_from,
                          type: value.message_to_type,
                          newM: false,
                          datetime: value.datetime
                      });
                      $scope.subjectForTeacher = value.message_subject;
                      if (value.message_read == '0') {
                          updateMessageString += value.message_id + ","
                      }
                      if ((index + 1) == historyMessages.length) {
                          if (updateMessageString) {
                              $scope.updateMessageRead(updateMessageString);
                          }
                      }
                  });
              }
          };

          $scope.getChat(getChatRequestParams);

          $scope.messages = [];

          $timeout(function() {
              $ionicScrollDelegate.scrollBottom(true);
          }, 1000);

      }])

      .controller('AlbumController', ["$scope", "$state", "$timeout", function($scope, $state, $timeout) {
          $scope.album = $state.params.album;
          console.log($scope.album);
          // var numberOfRecords = Math.ceil($scope.album[0].gallery.length/4)
          $scope.albumRows = chunk($scope.album.gallery, 4);
          console.log($scope.albumRows);
          $scope.frobelsApi = "http://www.frobelsedu.com/admin/upload_images/galary_images/";

          function chunk(arr, size) {
              var newArr = [];
              for (var i = 0; i < arr.length; i += size) {
                  newArr.push(arr.slice(i, i + size));
              }
              return newArr;
          }

          $scope.singleImage = function(imageUrl) {
              $timeout(function() {
                  $state.go('app.singlephoto', { url: imageUrl });
              }, 3000);

          };

      }])

      .controller('SingleImageController', ["$scope", "$state", function($scope, $state) {
          console.log("Entered");
          $scope.imageUrl = $state.params.url;
          console.log($scope.imageUrl);
      }])

      .controller('TeacherController', ["$scope", "$state", "$rootScope", "FrobelsApi", "TeacherService", "ChatService", "$ionicScrollDelegate", function($scope, $state, $rootScope, FrobelsApi, TeacherService, ChatService, $ionicScrollDelegate) {
          var teacherId = $state.params.teacherId || JSON.parse(window.localStorage.getItem('loginDetails')).object_id;
          $scope.loginDetails = $rootScope.loginDetails || JSON.parse(window.localStorage.getItem('loginDetails'));
          $scope.getParentList = function(teacherId) {
              $rootScope.$broadcast('loading:show');
              TeacherService.parentListForTeacher(teacherId).then(
                  function(response) {
                      console.log(response);
                      $scope.parentsList = response.data.chat_members;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.textParent = function(index) {
              $state.go('app.message', { memberData: $scope.parentsList[index] });
          };

          var getChatRequestParams = {
              object_id: $scope.loginDetails.object_id,
              type: $scope.loginDetails.login_type,
              to_id: teacherId
          };

          $scope.getChat = function(getChatRequestParams) {
              $rootScope.$broadcast('loading:show');
              ChatService.getChat(getChatRequestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.chatHistoryList = response.data.chats;
                      $scope.getParentList(teacherId);
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getChat(getChatRequestParams);

          $scope.showUnread = function(index) {
              var chatListForTeacher = $scope.chatHistoryList.filter(function(value) {
                  return (value.message_to == index) || (value.message_from == index);
              });

              var showDot = false;

              if (chatListForTeacher.length > 0) {
                  chatListForTeacher.forEach(function(value) {
                      if (value.message_read == '0') {
                          console.log(value);
                          showDot = true;
                      }
                  });
              }
              return showDot;
          };
      }])

      .controller('ViewProfileController', ['$scope', '$rootScope', '$state', 'ProfileService', function($scope, $rootScope, $state, ProfileService) {
          console.log($rootScope.loginDetails);

          if ($state.params.type) {
              $scope.type = $state.params.type;
          }

          if ($state.params.personId) {
              $scope.personId = $state.params.personId;
          }

          $scope.getTeacherProfile = function(teacherId) {
              $rootScope.$broadcast('loading:show');
              ProfileService.viewTeacherProfile(teacherId).then(
                  function(response) {
                      console.log(response);
                      $scope.data = response.data[0];
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getStudentProfile = function(studentId, parentId) {
              $rootScope.$broadcast('loading:show');
              ProfileService.viewProfileForStudent(studentId, parentId).then(
                  function(response) {
                      console.log(response);
                      $scope.data = response.data[0];
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          if ($scope.type) {
              if ($scope.type == 'teacher') {
                  $scope.getTeacherProfile($scope.personId);
              } else if ($scope.type == 'parentType') {
                  $scope.getStudentProfile($scope.personId, $scope.personId);
              } else {
                  $scope.getStudentProfile($scope.personId)
              }
          }

      }])

      .controller('ParentAssignmentController', ['$scope', '$stateParams', '$state', '$rootScope', 'AssignmentService', function($scope, $stateParams, $state, $rootScope, AssignmentService) {
          $scope.studentId = $stateParams.studentId;

          /* View Assignments for parent child*/
          $scope.getAssigmentsForParent = function(studentId) {
              $rootScope.$broadcast('loading:show');
              var requestParams = { studentId: studentId };
              AssignmentService.getAssignments(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.assignments = response.data;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          /* View Assignments for teacher */

          $scope.getAssigmentsForTeacher = function(teacherId) {
              $rootScope.$broadcast('loading:show');
              var requestParams = { teacherId: teacherId };
              AssignmentService.getAssignments(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.assignments = response.data;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.assignmentFilter = {};

          if (window.localStorage.getItem('login_type') == 'parent') {
              $scope.getAssigmentsForParent($scope.studentId);
          } else if (window.localStorage.getItem('login_type') == 'teacher') {
              $scope.getAssigmentsForTeacher(JSON.parse(window.localStorage.getItem('loginDetails')).object_id);
          } else {
              $scope.getAssigmentsForTeacher($state.params.teacherId);
          }

      }])

      .controller('TeacherAssignmentController', ['$scope', '$rootScope', '$cordovaToast', 'AssignmentService', function($scope, $rootScope, $cordovaToast, AssignmentService) {
          $scope.seletedItem = {};
          $scope.getAssigmentsForTeacher = function(teacherId) {
              $rootScope.$broadcast('loading:show');
              var requestParams = { teacherId: teacherId }
              AssignmentService.getAssignments(requestParams).then(
                  function(response) {
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.createAssignment = function(selectedItem) {
              console.log(selectedItem);
              $rootScope.$broadcast('loading:show');
              var requestParams = {
                  classId: selectedItem.class.class_id,
                  teacherId: JSON.parse(window.localStorage.getItem('loginDetails')).object_id,
                  subjectId: selectedItem.subject.subject_id,
                  message: selectedItem.message,
                  date: new Date()
              };

              AssignmentService.createAssignments(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.seletedItem = {};
                      $rootScope.$broadcast('loading:hide');
                      $cordovaToast.showLongTop("Assignment created successfully").then(
                          function(success) {

                          },
                          function(error) {

                          }
                      )
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )

          };

          $scope.seletecItem = {};

          $scope.getAllClassAndSubjects = function() {
              $rootScope.$broadcast('loading:show');
              AssignmentService.getListOfClassesAndSubjcts().then(
                  function(response) {
                      console.log(response);
                      $scope.classes = response.data.classes;
                      $scope.subjects = response.data.subjects;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getAllClassAndSubjects();
      }])

      .controller('TeacherAttendanceController', ['$scope', '$state', '$rootScope', '$cordovaToast', 'AssignmentService', 'AttendanceService', function($scope, $state, $rootScope, $cordovaToast, AssignmentService, AttendanceService) {
          $scope.seletecdClass = {
              value: '',
              session: ''
          };

          $scope.showForms = {
              classSelectForm: true,
              studentsDisplayForm: false
          };
          $scope.date = new Date();

          $scope.attendiesList = [];
          // $scope.attendiesList1 = [];

          $scope.getListOfClassesAndSubjects = function() {
              $rootScope.$broadcast('loading:show');
              AssignmentService.getListOfClassesAndSubjcts().then(
                  function(response) {
                      $scope.classes = response.data.classes;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          }

          $scope.getListOfClassesAndSubjects();

          $scope.fetchChildren = function(selectedClass) {
              $rootScope.$broadcast('loading:show');
              AttendanceService.getStudentsByClassId(selectedClass.value.class_id, selectedClass.session).then(
                  function(response) {
                      console.log(response);
                      if (response.data.students.length > 0) {
                          $scope.insertOrUpdateAttendance = response.data.attType
                          $scope.currentSession = selectedClass.session;
                          var attendiesList = response.data.students;
                          var iteratedvalue = 0;

                          attendiesList.forEach(function(value, key) {
                              iteratedvalue++;
                              $scope.attendiesList['attendie' + (key + 1)] = value.attendance;

                              if (iteratedvalue === attendiesList.length) {
                                  console.log($scope.attendiesList);
                                  $scope.students = response.data.students;
                                  console.log($scope.students);
                              }

                          })

                          $scope.showForms.classSelectForm = false;
                          $scope.showForms.studentsDisplayForm = true;

                      }
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )

          };

          $scope.showResults = function(list) {
              $rootScope.$broadcast('loading:show');
              var attendiesStatus = [];

              for (var i = 0; i < Object.keys(list).length; i++) {
                  var obj = {
                      status: list[Object.keys(list)[i]],
                      studentId: $scope.students[i].student_id
                  }
                  attendiesStatus.push(obj);
              }

              var students = attendiesStatus;
              var absenties = '';
              var presenties = '';
              var lateComers = '';

              for (var student in students) {
                  var studentId = students[student].studentId;
                  var status = students[student].status;

                  if (status == 'P') {
                      presenties += studentId + ':0,';
                  } else if (status == 'A') {
                      absenties += studentId + ',';
                  } else {
                      presenties += studentId + ':1,';
                  }
              }

              absenties = absenties.substring(0, absenties.length - 1);
              presenties = presenties.substring(0, presenties.length - 1);

              console.log(`Absenties : ${absenties}, Presenties : ${presenties}, session: ${$scope.currentSession}, teacherId: ${JSON.parse(window.localStorage.getItem('loginDetails')).object_id}`);
              $scope.submitAttendance($scope.insertOrUpdateAttendance, absenties, presenties, $scope.currentSession, JSON.parse(window.localStorage.getItem('loginDetails')).object_id);
              $rootScope.$broadcast('loading:hide');
          };

          $scope.submitAttendance = function(type, a, p, s, t_id) {
              var requestParams = {
                  date: new Date(),
                  absentees: a,
                  presentees: p,
                  session: s,
                  teacherId: t_id
              }
              if (type === 'Insert') {
                  $rootScope.$broadcast('loading:show');
                  AttendanceService.insertStudentAttendance(requestParams).then(
                      function(response) {
                          if (response) {
                              $rootScope.$broadcast('loading:hide');
                              $cordovaToast.showLongTop("Attendance inserted successfully").then(
                                  function(success) {
                                      $state.go('app.dashboard');
                                  },
                                  function(error) {

                                  }
                              )

                          }
                      },
                      function(error) {
                          $rootScope.$broadcast('loading:hide');
                          console.log(error);
                      }
                  )
              } else {
                  $rootScope.$broadcast('loading:show');
                  AttendanceService.updateStudentAttendance(requestParams).then(
                      function(response) {
                          if (response) {
                              $rootScope.$broadcast('loading:hide');
                              $cordovaToast.showLongTop("Attendance Submitted successfully").then(
                                  function(success) {
                                      $state.go('app.dashboard');
                                  },
                                  function(error) {
                                      console.log(error);
                                  }
                              )
                          }
                      },
                      function(error) {
                          $rootScope.$broadcast('loading:hide');
                          console.log(error);
                      }
                  )
              }
          };

      }])

      .controller('ContactUsController', ["$scope", '$rootScope', "ContactusService", function($scope, $rootScope, ContactusService) {
          var schoolId = window.localStorage.getItem('schoolId');
          console.log(schoolId);
          $scope.getSchoolContact = function() {
              $rootScope.$broadcast('loading:show');
              ContactusService.contactUs(schoolId).then(
                  function(response) {
                      $scope.schoolDetails = response.data.schoolDetails[0];
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getSchoolContact();

      }])

      .controller('SearchParentController', ["$scope", '$rootScope', "TeacherService", "$state", function($scope, $rootScope, TeacherService, $state) {
          $scope.showDetails = false;
          $scope.searchParent = function(admNo) {
              $rootScope.$broadcast('loading:show');
              TeacherService.searchparent(admNo).then(
                  function(response) {
                      console.log(response);
                      if (response.data.length) {
                          $scope.showDetails = 'show';
                          $scope.parentDetails = response.data[0];

                      } else {
                          $scope.showDetails = 'error';
                      }
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };
          $scope.textParent = function() {
              $state.go('app.message', { memberData: $scope.parentDetails });
          };
      }])

      .controller('TimeTableController', ["$scope", "$rootScope", "TeacherService", "$filter", function($scope, $rootScope, TeacherService, $filter) {
          $scope.timetableData = [];

          $scope.timetable = function() {
              $rootScope.$broadcast('loading:show');
              TeacherService.timetable(JSON.parse(window.localStorage.getItem('loginDetails')).object_id).then(
                  function(response) {
                      if (response.data.length > 0) {
                          $scope.timetableData = response.data;
                      }
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.timetable();
          $scope.search = {selectedDate :""}
          $scope.formattedDate = "";
          $scope.formatDate = function() {
              if ($scope.search.selectedDate) {
                  $scope.formattedDate = $scope.selectedDate.getMonth() + 1 + '/' + $scope.selectedDate.getDate() + '/' + $scope.selectedDate.getFullYear();
                  
              }
          }

          //$scope.timetableData.date = $filter("date")(Date.now(), 'dd/MM/yyyy');
          //console.log("timetableData.date", $scope.timetableData.date);
          $scope.enteredDate = "";
          $scope.convertDate = function(date) {
              console.log("convert date:", date);
              var myDate = new Date(date);
              var month = lessThanTen(myDate.getMonth() + 1);
              var date = lessThanTen(myDate.getDate());
              var year = myDate.getFullYear();
              var format = month + '/' + date + '/' + year
              console.log("format", format);
              $scope.enteredDate = format;
              //return format;
          }

          function lessThanTen(value) {
              return value < 10 ? '0' + value : value;
          }

      }])

      .controller('ApplyLeaveController', ["$scope", "$rootScope", "$cordovaToast", "TeacherService", function($scope, $rootScope, $cordovaToast, TeacherService) {
          $scope.applyObj = {};

          $scope.applyLeave = function(obj) {
              var requestParams = {
                  from_date: obj.from,
                  to_date: obj.to,
                  objectId: JSON.parse(window.localStorage.getItem('loginDetails')).object_id,
                  desc: obj.desc,
                  type: 'teacher',
                  days: obj.days
              };

              $rootScope.$broadcast('loading:show');
              TeacherService.insertLeaveDetails(requestParams).then(
                  function(response) {
                      console.log(response);
                      $rootScope.$broadcast('loading:hide');
                      $cordovaToast.showLongTop("Leave applied successfully").then(
                          function(success) {
                              $scope.applyObj = {};
                              // $state.go('app.dashboard');
                          },
                          function(error) {

                          }
                      )
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };
      }])

      .controller('ViewAppliedLeavesController', ["$scope", "$rootScope", "TeacherService", function($scope, $rootScope, TeacherService) {
          $scope.showListOfDetails = function() {
              var requestParams = {
                  objectId: JSON.parse(window.localStorage.getItem('loginDetails')).object_id,
                  type: 'teacher'
              };

              $rootScope.$broadcast('loading:show');
              TeacherService.getLeaveDetails(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.noOfDays = response.data.noOfDays;
                      $scope.details = response.data.leaveDetails;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };
          $scope.showListOfDetails();
      }])

      .controller('FeeDetailsController', ["$scope", "$rootScope", "ParentService", function($scope, $rootScope, ParentService) {
          $scope.feeDetails = function() {
              // window.localStorage.currentStudentId
              // 1367 for testing
              $rootScope.$broadcast('loading:show');
              ParentService.feedetails(window.localStorage.currentStudentId).then(
                  function(response) {
                      console.log(response);
                      $scope.details = response.data.feeDetails;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.feeDetails();
      }])

      .controller('AdminAnnoucmentsController', ["$scope", "$rootScope", "$state", "$cordovaToast", "AdminService", function($scope, $rootScope, $state, $cordovaToast, AdminService) {
          $scope.assignment = {};

          $scope.createAnnouncement = function(assignment) {
              $rootScope.$broadcast('loading:show');
              console.log(assignment);

              var requestParams = {
                  note_from: assignment.from,
                  note_sub: assignment.subject,
                  msg: assignment.message,
                  date: assignment.date,
                  note_to: assignment.to
              }

              AdminService.createAssignment(requestParams).then(
                  function(response) {
                      console.log(response);
                      $rootScope.$broadcast('loading:hide');
                      $scope.assignment = {};
                      /*
                      $cordovaToast.showShortTop(response.data.response).then(
                        function(success) {
                          $state.go('app.dashboard');
                        },
                        function(error) {
                          console.log(error);
                        }
                      )
                      */

                      $state.go('app.dashboard');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

      }])

      .controller('AdminAttendanceController', ["$scope", "$rootScope", "AdminService", "AssignmentService", function($scope, $rootScope, AdminService, AssignmentService) {
          $rootScope.$broadcast('loading:show');
          $scope.attendanceDetails = [];
          $scope.resultsText = false;
          AssignmentService.getListOfClassesAndSubjcts().then(
              function(response) {
                  $scope.classes = response.data.classes;
                  $rootScope.$broadcast('loading:hide');
              },
              function(error) {
                  console.log(error);
                  $rootScope.$broadcast('loading:hide');
              }
          )
          $scope.getAdminAttendance = function(selectedClass, applyObj) {
              var requestParams = {
                  class_id: selectedClass.value.class_id,
                  date: applyObj.to
              };
              AdminService.getAttendanceForAdmin(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.attendanceDetails = response.data.class_att;
                      $scope.resultsText = true;
                      $rootScope.$broadcast('loading:hide');

                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  })
          }

      }])

      .controller('FindSchoolController', ['$scope', '$state', function($scope, $state) {
          $scope.enteredSchool = "";
          $scope.isSchoolNotSelected = true;
          //need to connect with service with spinner on

          var schoolsList = [
              "ABCD", "ABCDE", "ABCDEF", "MNP", "XTB", "AXFORD"
          ];

          $scope.onFocus = function() {
              $scope.isSchoolNotSelected = true;
              $scope.enteredSchool = "";
          }

          $scope.selectASchool = function(matchingSchool) {
              $scope.enteredSchool = matchingSchool;
              $scope.matchingSchools = [];
              $scope.isSchoolNotSelected = false;
          }

          $scope.searchSchool = function(enteredSchool) {
              $scope.matchingSchools = [];
              schoolsList.filter(function(school) {
                  if (school.toLowerCase().indexOf(enteredSchool.toLowerCase()) != -1) {
                      $scope.matchingSchools.push(school);
                  }
              });
          }

          $scope.findSchool = function() {
              if ($scope.enteredSchool) {
                  schoolsList.filter(function() {
                      $state.go('login', { selectedSchool: $scope.enteredSchool })
                  });
              }
          }
      }])

      .controller('LeaveManagementController', ["$scope", "$rootScope", "AdminService", function($scope, $rootScope, AdminService) {
          $scope.getLeaveDetails = function() {
              $rootScope.$broadcast('loading:show');
              AdminService.getLeaveDetails().then(
                  function(response) {
                      console.log(response);
                      $scope.leaveDetails = response.data.leaveDetails;
                      $rootScope.$broadcast('loading:hide');

                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          }

          $scope.getLeaveDetails();

          $scope.updateDetails = function(id, status) {
              console.log(`${id}, ${status}`);
              var requestParams = {
                  leave_id: id,
                  status: status
              };

              $rootScope.$broadcast('loading:show');
              AdminService.updateLeaveDetails(requestParams).then(
                  function(response) {
                      $rootScope.$broadcast('loading:hide');
                      $scope.getLeaveDetails();
                  },
                  function(error) {
                      $rootScope.$broadcast('loading:hide');
                      console.log(error);
                  }
              )
          };

      }])

      .controller('AdminChatController', ["$scope", "$rootScope", "$state", "AdminService", function($scope, $rootScope, $state, AdminService) {
          $scope.teacherListFilter = {
              value: ""
          };

          $scope.teachersList = $state.params.teachers;
          var loginDetails = JSON.parse(window.localStorage.loginDetails);

          $scope.textTeacher = function(emp) {
              console.log("loginDetails", " ", loginDetails);

              var memberData = {
                  emp_id: emp.emp_id,
                  object_id: loginDetails.iAdminId,
                  login_type: loginDetails.login_type
              };
              $state.go('app.message', { memberData: memberData });
          };

      }])

      .controller('AdminParentListViewController', ["$scope", "$rootScope", "$stateParams", "$state", "TeacherService", function($scope, $rootScope, $stateParams, $state, TeacherService) {
          $scope.teacherId = $stateParams.teacherId;
          $scope.loginUser = window.localStorage.getItem('login_type');
          $scope.getParentsList = function(teacherId, login_type) {
              $rootScope.$broadcast('loading:show');
              TeacherService.parentListForTeacher(teacherId, login_type).then(
                  function(response) {
                      $scope.parentsList = response.data.chat_members;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              );
          };

          $scope.viewConversation = function(teacherId, parent) {
              console.log(teacherId);
              console.log(parent);
              // $state.go('app.message', {teacherId: teacherId, meme})
              $state.go('app.message', { teacherId: teacherId, memberData: parent });
          };

          $scope.getParentsList($scope.teacherId, $scope.loginUser);

      }])

      .controller('AdminAssignmentController', ["$scope", "$rootScope", "$state", "AdminService", function($scope, $rootScope, $state, AdminService) {
          $scope.teacherListFilter = {
              value: ""
          };

          $scope.teachersList = $state.params.teachers;

      }])

      .controller('AdminResultController', ["$scope", "$rootScope", "$state", "AdminService", "AssignmentService", function($scope, $rootScope, $state, AdminService, AssignmentService) {

          $scope.seletecdClass = {
              value: ''
          };

          $scope.marksdiv = {
              display: false
          };

          $scope.getListOfClassesAndSubjects = function() {
              $rootScope.$broadcast('loading:show');
              AssignmentService.getListOfClassesAndSubjcts().then(
                  function(response) {
                      $scope.classes = response.data.classes;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          }

          $scope.getListOfClassesAndSubjects();

          $scope.getMarks = function(selectedClass) {
              console.log(selectedClass);
              var requestParams = {
                  class_id: selectedClass.value.class_id
              };
              AdminService.getMarksForAdmin(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.classAverage = response.data.class_avg;
                      $scope.studentMarks = response.data.student_marks;
                      $scope.examname = response.data.exam_names;
                      $scope.marksdiv.display = true;
                  },
                  function(error) {
                      console.log(error);
                  }
              )

          };

      }])

      .controller('AdminFeeDetailsController', ["$scope", "$rootScope", "$state", "AdminService", "AssignmentService", function($scope, $rootScope, $state, AdminService, AssignmentService) {

          $scope.seletecdClass = {
              value: ''
          };

          $scope.feeview = {
              display: false
          };

          $scope.getListOfClassesAndSubjects = function() {
              $rootScope.$broadcast('loading:show');
              AssignmentService.getListOfClassesAndSubjcts().then(
                  function(response) {
                      $scope.classes = response.data.classes;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )
          };

          $scope.getListOfClassesAndSubjects();

          $scope.getFeeDetails = function(selectedClass) {
              console.log(selectedClass);
              var requestParams = {
                  class_id: selectedClass.value.class_id
              };

              $rootScope.$broadcast('loading:show');
              AdminService.feeDetails(requestParams).then(
                  function(response) {
                      console.log(response);
                      $scope.feeview.display = true;
                      $scope.feeData = response.data.class_fee;
                      $rootScope.$broadcast('loading:hide');
                  },
                  function(error) {
                      console.log(error);
                      $rootScope.$broadcast('loading:hide');
                  }
              )

          };

      }])


      .filter('dateFormat', function() {
          return function(input) {
              if (input) {
                  console.log("input", input[0]);
                  // var filterDate = $filter('date')(new Date(input), 'dd/MM/yyyy');
                  // console.log("filterDate", filterDate);
                  // return filterDate;
              }

          };
      });
  /*
  ,
  "proxies": [
    {
      "path": "/webservices",
      "proxyUrl": "http://www.frobelsedu.com/webservices"
    }
  ]

  */