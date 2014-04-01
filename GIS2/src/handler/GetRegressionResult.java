package handler;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class GetRegressionResult
 */
@WebServlet("/GetRegressionResult")
public class GetRegressionResult extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetRegressionResult() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String regData = request.getParameter("regData");
		String targetPath = "/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/target.csv";
		String targetMag = FileResult.targetMag;
		String amenityPath = "/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/";
		String[] userInput = regData.split("~");
		String preparedInput = targetPath + "," + targetMag + ",";
		for(String xLine : userInput){
			String[] xLineVals = xLine.split(",");
			String amenityFullPath = amenityPath + xLineVals[0] + ".csv";
			preparedInput += (amenityFullPath + "," + xLineVals[1] + "," + xLineVals[2] + "," + xLineVals[0] + "~");
		}
		System.out.println(preparedInput);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}