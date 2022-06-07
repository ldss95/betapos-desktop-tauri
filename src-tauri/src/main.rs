#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

use std::process::Command;

fn main() {
	test_printer();

	Command::new("npm")
		.current_dir("../src-node/")
		.arg("run")
		.arg("dev");

	tauri::Builder::default()
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
