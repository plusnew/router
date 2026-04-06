{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    npmlock2nixSrc = {
      url = "github:nix-community/npmlock2nix";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-utils, npmlock2nixSrc }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system};

        in {
          devShells.default = pkgs.mkShell (with pkgs; {
            packages = [
              importNpmLock.hooks.linkNodeModulesHook
              nodejs
            ];

            npmDeps = npmDeps;
          });

          checks.default = pkgs.buildNpmPackage {
            name = "plusnew-router";
            src = ./.;
            npmDeps = npmDeps;
          };
        }
      );
}

