<#
.SYNOPSIS
    Sets up the GitHub Git Shell Environment
.DESCRIPTION
    Sets up the proper PATH and ENV to use GitHub for Window's shell environment
    Don't edit this file directly, it is generated on install.
    Generally you would run this from your Powershell Profile like this:

    . (Resolve-Path "$env:LOCALAPPDATA\GitHub\shell.ps1")

.PARAMETER SkipSSHSetup
    If true, skips calling GitHub.exe to autoset and upload ssh-keys
#>
[CmdletBinding()]
Param(
    [switch]
    $SkipSSHSetup = $false
)

if ($env:github_shell -eq $null) {

  Write-Verbose "Running GitHub\shell.ps1"

  Push-Location (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)

  $env:github_posh_git = Resolve-Path "$env:LocalAppData\GitHub\PoshGit_a2be688889e1b24632e83adccd9b2a44b91d655b"
  $env:github_git = Resolve-Path "$env:LocalAppData\GitHub\PortableGit_d7effa1a4a322478cd29c826b52a0c118ad3db11"
  $env:PLINK_PROTOCOL = "ssh"
  $env:TERM = "msys"
  $env:HOME = $HOME
  $env:TMP = $env:TEMP = [system.io.path]::gettemppath()
  if ($env:EDITOR -eq $null) {
    $env:EDITOR = "GitPad"
  }

  # Setup PATH
  $pGitPath = $env:github_git
  $appPath = Resolve-Path "$env:LocalAppData\Apps\2.0\MV5J8EYE.TDG\HW4GGQRO.NV5\gith..tion_317444273a93ac29_0003.0003_665ccbdbd3c2d8d4"
  $msBuildPath = "$env:SystemRoot\Microsoft.NET\Framework\v4.0.30319"

  $env:Path = "$env:Path;$pGitPath\cmd;$pGitPath\usr\bin;$pGitPath\usr\share\git-tfs;C:\Users\tc20791\AppData\Local\GitHub\lfs-amd64_1.3.1;$appPath;C:\Program Files (x86)\MSBuild\14.0\bin\;C:\Program Files (x86)\Microsoft SDKs\Windows\v8.1A\bin\NETFX 4.5.1 Tools\x64"

  if (!$SkipSSHSetup) {
    & (Join-Path $appPath GitHub.exe) --set-up-ssh
  }

  Pop-Location

} else { Write-Verbose "GitHub shell environment already setup" }
$currentUser = (whoami /fqdn).split(",")[0].split("=")[1]
cd C:\Users\$currentUser\Desktop\test

git commit --no-verify -a --allow-empty-message --no-edit
git push
