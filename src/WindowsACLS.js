
const child_process = require('child_process');

const ACL_STRINGS = [
  'S-1-15-3-1024-2302894289-466761758-1166120688-1039016420-2430351297-4240214049-4028510897-3317428798:(OI)(CI)(RX)',
  'S-1-15-3-1024-3424233489-972189580-2057154623-747635277-1604371224-316187997-3786583170-1043257646:(OI)(CI)(RX)',
];

class WindowsACLs {
  static grantRequiredACLs() {
    return new Promise(resolve => {
      // Check working directory's existing ACLs against our list of ACL strings
      child_process.exec('icacls .', null, (err, output) => {
        const existingACLs = output.toString();
        console.log('WindowsACLS: existing ACLs: ', existingACLs);
  
        const missingACLs = ACL_STRINGS.filter(acl => existingACLs.indexOf(acl) == -1);
        if (missingACLs.length > 0) {
          let cmd = 'icacls .';
          missingACLs.forEach(acl => cmd += ` /grant *${acl}`);

          console.log('WindowsACLS: executing command to grant missing ACLS: ', cmd);
          child_process.exec(cmd, null, resolve);
        } else {
          console.log('WindowsACLS: application already has all required ACLs, proceeding...');
          resolve();
        }
      });
    });
  }
}

module.exports = WindowsACLs;
