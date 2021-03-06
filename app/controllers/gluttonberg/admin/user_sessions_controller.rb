module Gluttonberg
  module Admin
    class UserSessionsController < Gluttonberg::Admin::BaseController
      layout 'bare'

      skip_before_filter :require_user, :only => [:new, :create]
      skip_before_filter :require_backend_access, :only => [:new, :create]

      def new
        @user_session = UserSession.new
      end

      def create
        @user_session = UserSession.new(params[:user_session])
        if @user_session.save
          flash[:notice] = "Login successful!"
          redirect_back_or_default admin_root_path
        else
          render :action => :new
        end
      end

      def destroy
        current_user_session.destroy
        flash[:notice] = "Logout successful!"
        redirect_back_or_default admin_root_path
      end
    end
  end
end