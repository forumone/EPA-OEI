# Revert the database when a rollback occurs
Rake::Task["deploy:published"].enhance do
  invoke "sails:restart"
end

namespace :sails do
  desc "Restart Sails"
  task :restart do
    on roles(:app) do
      within "#{release_path}" do
        execute :npm, :install
        execute "forever stop #{current_path}/app.js || :"
      end
      within "#{release_path}" do 
        execute "NODE_ENV=#{fetch(:stage)} forever start #{current_path}/app.js"
      end
    end
  end
  
  desc "Install Sails"
  task :install do
  end
  
  desc "Copy Sails configuration file"
  task :settings do
    on roles(:app) do
      if test " [ -f #{current_path}/sailsrc.#{fetch(:stage)} ]"
        if test " [ -f #{current_path}/.sailsrc ]"
          execute :rm, "#{current_path}/.sailsrc"
        end
      
        execute :ln, '-s', "#{current_path}/sailsrc.#{fetch(:stage)}", "#{current_path}/.sailsrc"
      end
    end
  end
  
  desc "Revert the database"
  task :revert_database do
  end
  
  desc "Backup the database"
  task :dbbackup do
  end
end
