process.on('unhandledRejection', (reason, _p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});

process.on('uncaughtException', (reason, _p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});
